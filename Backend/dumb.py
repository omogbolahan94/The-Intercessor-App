import asyncio
import time


async def greet(name, delay):
    await asyncio.sleep(delay)  
    print(f"Hello {name}!")
    return name

# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Sequential & Concurrent>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# async def sequential():
#     start = time.time()
#     await greet("A", 3)
#     await greet("B", 1)
#     print(f"Total time spent is: {round(time.time() - start,2)}")

# asyncio.run(sequential())

# async def concurrent():
#     start = time.time()
#     result = await asyncio.gather(greet("A", 3), greet("B", 1))
#     print(f"Total time spent is: {round(time.time() - start, 2)}")
#     return result

# asyncio.run(concurrent())
# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<gather, Create_task, wait>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
# async def job(n):
#     await asyncio.sleep(n)
#     return f"job-{n}"

# async def main():
#     # gather → run together, get results in order
#     results = await asyncio.gather(job(1), job(3))
#     print(results)  # ['job-1', 'job-2']

#     # create_task → schedule now, await later (gives you control)
#     t = asyncio.create_task(job(1))
#     print("task is running in background...")
#     result = await t  # wait for it when ready

#     # wait → useful when you need timeout or first-completed
#     tasks = [asyncio.create_task(job(i)) for i in range(3)]
#     done, pending = await asyncio.wait(tasks, timeout=1.5)
#     print(f"{len(done)} finished, {len(pending)} timed out")

# asyncio.run(main())
# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

# <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< lock >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
counter = 0
lock = asyncio.Lock()

async def increment():
    global counter
    async with lock:       # only one coroutine enters at a time
        val = counter
        await asyncio.sleep(0)
        counter = val + 1

async def main():
    await asyncio.gather(*[increment() for _ in range(10)])
    print(counter)  # always 10 ✅

asyncio.run(main())