import pandas as pd
from sklearn.linear_model import LinearRegression
from sqlalchemy import create_engine
from datetime import datetime, timedelta
import json, sys
import os
from dotenv import load_dotenv

DB_USER = os.getenv('DB_USERNAME')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

load_dotenv()

gameId = sys.argv[1]

query = f'''SELECT "dealDate", "deal" FROM sale_history WHERE "gameId" = '{gameId}' ORDER BY "dealDate" ASC'''
engine = create_engine(f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}')
df = pd.read_sql(query, engine)

df = df.dropna()

if(len(df) < 2):
  print(json.dumps({"error": "Not enough data"}))
  sys.exit(0)

df['dealDate'] = pd.to_datetime(df['dealDate'])
df['interval'] = df['dealDate'].diff().dt.days
avg_days = df['interval'].mean()

if df['dealDate'].empty or pd.isna(df['dealDate'].iloc[-1]):
  print(json.dumps({'error': "Insufficient amount of data"}))
  sys.exit(0)

if(pd.isna(avg_days)) or avg_days <= 0:
  avg_days = 30
    
next_date = df['dealDate'].iloc[-1] + timedelta(days=int(avg_days))

df['date_ordinal'] = df['dealDate'].map(datetime.toordinal)
X = df[['date_ordinal']].values
y = df['deal'].values

model = LinearRegression()
model.fit(X, y)
predicted_price = model.predict([[next_date.toordinal()]])[0]

print(json.dumps({
  "predictionPrice": round(float(predicted_price), 2),
  "predictionDate": next_date.strftime('%Y%m-%d')
}))