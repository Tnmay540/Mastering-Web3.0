import hashlib
import time

def str_to_byte(str):
    return bytes(str, 'ascii')


m = hashlib.sha256()
inp_str = input("Please enter your input message : \n")
str_loop = inp_str
target = 0x00000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
i = 0
counter = 1
start = time.time()
while counter:
    str_loop = inp_str
    n = str(i)
    str_loop += n
    s_b = str_to_byte(str_loop)
    n = hashlib.sha256()
    n.update(s_b)
    if (n.hexdigest()) < str(target):
        counter = 0
        print(i)
    i+=1
end = time.time()
print(f"time to find nonce : {end - start}")
