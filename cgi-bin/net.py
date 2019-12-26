import json
from pathlib import *


INPUT_FILE = Path.cwd().joinpath('data\in.json')
OUTPUT_FILE = Path.cwd().joinpath('data\out.json')

def read():
    with open(INPUT_FILE) as f:
        df = json.load(f)
    return df

def write(df):
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(df, f, ensure_ascii=False)

def respons(json_data):
    print('Content-Type: application/json; charset=utf-8\n')
    print(json_data)

df = read()
write(df)
respons(df)
