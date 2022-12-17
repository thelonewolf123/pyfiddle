import micropip

packages_list = [
    'http://localhost:8080/wheel/python_language_server-0.36.2+1.ga91a257.dirty-py3-none-any.whl',
    'http://localhost:8080/wheel/python_jsonrpc_server-0.4.0+0.g73ab099.dirty-py3-none-any.whl',
    'jedi',
    'backports.functools_lru_cache',
    'future',
    'configparser',
    'pluggy'
]

print(micropip.list())
for pkg in packages_list:
    await micropip.install(pkg)
    print(f'install success {pkg}')
