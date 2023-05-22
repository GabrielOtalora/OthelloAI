from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time

from webdriver_manager.chrome import ChromeDriverManager

options = Options()
options.add_experimental_option("detach", True)


driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
# driver = webdriver.Chrome(executable_path=r'C:\Users\gabri\Documents\chromeDriver.exe')

# driver.get(r'file:C:\Users\gabri\Documents\Sistemas Inteligentes\othello\defOthelo\arena.html')
driver.get(
    r'file:C:\Users\gabri\Documents\Sistemas Inteligentes\othello\defOthello\arena.html')
# driver.get("https://www.google.com")
driver.maximize_window()

victorias_jugador1 = 0
victorias_jugador2 = 0
empates = 0

for i in range(1, 3):
    # Duración
    driver.find_element(By.XPATH, '//*[@id="time"]').send_keys("20")
    # Tamaño
    driver.find_element(By.XPATH, '//*[@id="size"]').send_keys("9")
    # Jugadores
    driver.find_element(By.XPATH, '//*[@id="W"]').send_keys("jugador1")
    driver.find_element(By.XPATH, '//*[@id="B"]').send_keys("jugador2")
    # Correr
    driver.find_element(By.XPATH, '//*[@id="play"]').click()

    while True:
        if 'jugador1' in driver.find_element(By.XPATH, '//*[@id="log"]').text:
            victorias_jugador1 += 1
            driver.refresh()
            time.sleep(1)

            break
        elif 'jugador2' in driver.find_element(By.XPATH, '//*[@id="log"]').text:
            victorias_jugador2 += 1
            driver.refresh()
            time.sleep(1)
            break
        elif 'Draw' in driver.find_element(By.XPATH, '//*[@id="log"]').text:
            empates += 1
            driver.refresh()
            time.sleep(1)
            break


print('jugador1:\t' + str(victorias_jugador1))
print('jugador2:\t' + str(victorias_jugador2))
