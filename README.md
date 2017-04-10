# Device Sensor Quickstart

Welcome to the Device Sensor Quickstart!

This application is written as a basic HTML/JavaScript app with Murano Solution event handlers, routes, modules, and static assets. This example is intended to be minimal with only a few endpoints and rendering requirements.

This is a simple demonstration to provide access to devices associated with a basic solution while exercising all the available endpoints. After devices are created and activated you will see information about each device in the "Available Devices" section.

## Using This Example

Clone this [repository](https://github.com/exosite/device-sensor-quickstart.git).

```sh
git clone git@github.com:exosite/device-sensor-example.git
cd device-sensor-example
```

To deploy this application, first [create a solution](http://docs.exosite.com/reference/ui/create-solution/) in [Exosite Murano](https://www.exosite.io/business/solutions). Then [create a Product](http://docs.exosite.com/reference/ui/create-product/) in the [Exosite Murano](https://www.exosite.io/business/products).

Install the [murano command line tool](http://docs.exosite.com/development/tools/murano-cli/). Then initialize the project with your solution id and product id using the following commands (where XXXXXX is your respective identifier):

```sh 
murano config business.id XXXXXX
murano config solution.id XXXXXX
murano config product.id XXXXXX
murano -V syncup --all
murano assign set
```

Navigate to your [solution](https://www.exosite.io/business/solutions) web application at an address similar to:
https://mysolution.apps.exosite.io

Information about the available API endpoints is accessible at the /docs URL of your deployed solution (e.g., https://mysolution.apps.exosite.io/docs).
