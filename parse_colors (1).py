from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')
driver = webdriver.Chrome(options=options)
driver.get("https://daveholloway.uk/")
bg = driver.execute_script("return window.getComputedStyle(document.body).backgroundColor")
color = driver.execute_script("return window.getComputedStyle(document.body).color")
links = driver.execute_script("""
    let links = document.querySelectorAll('a');
    if(links.length > 0) return window.getComputedStyle(links[0]).color;
    return null;
""")
print(f"Body BG: {bg}")
print(f"Body Color: {color}")
print(f"Link Color: {links}")
driver.quit()
