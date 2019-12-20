import random
import time

def make_question(q_max=10, c_max=12):
    AZ09 = 'abcdefghijklmnopqrstuvwxyz0123456789'
    OUTPUT = './question.txt'
    q=[]

    for i in range(q_max):
        s=""
        for _ in range(random.randint(1, c_max+1)):
            s += AZ09[random.randint(0, len(AZ09)-1)]
        q.append(s)
    
    return ",".join(q)

df = make_question()
time.sleep(1)

print('Content-Type: text/plain; charset=utf-8\n')
print(df)
