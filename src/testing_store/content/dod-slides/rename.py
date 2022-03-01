import os




def run():
    cwd = os.getcwd()
    print(cwd)
    for count, filename in enumerate(os.listdir(cwd)):
        if filename == 'rename.py':
            continue

        dst = f"DODSlide{str(count)}.png"
        src =f"{cwd}\{filename}"  # foldername/filename, if .py file is outside folder
        dst =f"{cwd}\{dst}"
        print(src, dst)

        os.rename(src, dst)










if __name__ == "__main__":
    run()