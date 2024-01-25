# Magento Toolbox for VSCode

### WORK IN PROGRESS

Magento Toolbox is a Magento2 code generation tool for vscode.

## Implemented features

### Code inspection
- "Open class" when highlighting a namespace in an XML file:
![Preview](/assets/readme/class-hover.png)

- View or create observers when highlighting an event name:
![Preview](/assets/readme/observer-name-hover.png)

- View observed event name when highlighting observer class name
![Preview](/assets/readme/observer-class-hover.png)

- View interceptors (plugins & preferences) for a class or interface
![Preview](/assets/readme/interface-implementations.png)
![Preview](/assets/readme/class-plugins.png)

- View plugins for a function
![Preview](/assets/readme/function-plugin.png)

### Code generation
Some commands are available in the file tree context menu. For example, when clicking on `/etc` directory.

- Generate new module
![Preview](/assets/readme/generate-module.png)
- Generate a controller
- Generate a data patch
- Generate an empty config.xml
- Generate an empty crontab.xml
- Generate an empty di.xml
- Generate an empty layout.xml
- Generate an empty routes.xml
- Generate an empty system.xml
- Generate an observer
- Generate a plugin. You can highlight a function name and generate a plugin form the context menu.
- Generate a class or interface preference. Can generate from the context menu.
- Generate a ViewModel

![Preview](/assets/readme/context-generate.png)

### Other tools
- Generate Red Hat XML compatible magento XML catalog