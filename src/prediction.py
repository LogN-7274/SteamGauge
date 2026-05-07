import pandas as pd
import xgboost as xgb
from sqlalchemy import create_engine
from datetime import timedelta
import json, sys
import os
from dotenv import load_dotenv

DB_USER = os.getenv('DB_USERNAME')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')


engine = create_engine(f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}')

def calculate_prediction(gameId):
  query = f'SELECT "dealDate", "deal", "cut" FROM sale_history WHERE "gameId" = \'{gameId}\' ORDER by "dealDate" ASC'
  df = pd.read_sql(query, engine)
  df['dealDate'] = pd.to_datetime(df['dealDate'])
  df['daysSince'] = df['dealDate'].diff().dt.days.fillna(0)
  df['next_deal_price'] = df['deal'].shift(-1)
  
  X = df[['deal', 'cut']].copy()
  X['month'] = df['dealDate'].dt.month
  
  X_train = X[:-1]
  y_price = df['deal'][1:]
  y_days = df['daysSince'][1:]
  
  model_price = xgb.XGBRegressor(n_estimators=100)
  model_date = xgb.XGBRegressor(n_estimators=100)
  
  model_price.fit(X_train, y_price)
  model_date.fit(X_train, y_days)
  
  current = X.tail(1)
  
  pred_price = model_price.predict(current)[0]
  pred_days = model_date.predict(current)[0]
  
  predicted_date = df['dealDate'].max() + timedelta(days=int(pred_days))
  
  return{
    'predictionPrice': round(float(pred_price), 2),
    'predictionDate': predicted_date.strftime('%Y-%m-%d')
  }
  
if( __name__) == "__main__":
  gameId = sys.argv[1]
  print(json.dumps(calculate_prediction(gameId)))