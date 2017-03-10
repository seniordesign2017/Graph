Device Sensor Example App
==================

Welcome to the Device Sensor Example!

This application is written as a basic HTML/JavaScript app with Murano Solution event handlers, routes, modules and static assets.

This is a simple demonstration to provide access to devices associated with a basic solution while exercising all the available endpoints.  Begin by first creating a [Product](https://www.exosite.io/business/products) followed by one or more devices. After devices are created and activated you will see information about each device in the "Available Devices" section.

This example is intended to be minimal with only a few endpoints and rendering requirements.
Information about the available API endpoints is accessible [here](/docs).


Using This Example
------------------

Clone this repository.

```
git clone git@github.com:exosite/device-sensor-example.git
cd device-sensor-example
```

To deploy the application, first create a solution in Exosite Murano and select this application as the respository source.  Install the [murano command line tool](https://github.com/exosite/MuranoCLI). Then initialize the project with your solution and product id using the following command (where XXXXXX is your respective identifier):
```
murano config business.id XXXXXX
murano config solution.id XXXXXX
murano config product.id XXXXXX
murano -V syncup
murano assign set
```

Navigate to your [solution](https://www.exosite.io/business/solutions) web application at an address similar to:
https://<solution-name>.apps.exosite.io
