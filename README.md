# Neighborhood-Map-V2

I created this Web App as a project submission for the [**Front-End Web Developer Nanodegree**](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) I was taking at [**Udacity**](https://www.udacity.com/). 

Below I've included the project outline and reasoning behind this project as given by Udacity.  You can view a more detailed project rubric [**here**](https://review.udacity.com/#!/rubrics/17/view).

## Project Overview
You will develop a single page application featuring a map of your neighborhood or a neighborhood you would like to visit. You will then add functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content.

## Why this Project?
The neighborhood map application is complex enough and incorporates a variety of data points that it can easily become unwieldy to manage. There are a number of frameworks, libraries and APIs available to make this process more manageable and many employers are looking for specific skills in using these packages.
<br></br>

One requirement in creating this application was to use the Knockout.js library.  I satisfied this requirement and also included a few other libraries, frameworks and plugins.  They include: 

* **knockout.js** - the main requirement for the app, as described by Udacity, was to use KO
* **require.js** - the main reason I used require.js was to help keep my code modular but, I got the added benefit of being able to asyncronously load files as needed.
* **backbone.js** - used backbone for navigation via the backbone router.
* **jquery** - jquery is a dependancy for backbone and since I wanted to use backbone.js's router it was necessary to use jquery.
* **underscore.js** - again underscore is another dependancy for backbone and since I wanted to use backbone.js's router it was necessary to use underscore.
* [**css.js**](https://github.com/martinsb/require-css) - this require.js plugin enables asyncronous loading of css files via require.js
* [**util.js**](https://gist.github.com/BenJam/4504134) - this code snippet is not really a library, framework or plugin but is worth mentioning as the code is not mine.  This snippet is used to load .html files asyncronously as templates.


<br></br>
<hr></hr>

## To run this application

To run this Web App on your local machine you will need to set-up a simple web server.  There are multiple options available to do this, I will give 2 examples.

* python's [SimpleHTTPServer](#python-method)
* node.js's [Simple HTTP server](#node-method)

### Or you can view the GitHub hosted version of the [**Web App**](https://go-0100-it.github.io/Neighborhood-Map-V2/).
<br></br>
<hr></hr>

<a id="python-method"></a>
### **Python** - SimpleHTTPServer method

1. You'll need Python version 2.7 installed.  If you don't have Python installed see [**here**](https://www.python.org/downloads/release/python-2713/) for the download and installation method.  Once you have python installed you can proceed to step 2.

2. On the Neighborhood Maps's [main repository page](https://github.com/go-0100-it/Neighborhood-Map-V2 "Go to main repository page") click &nbsp;![Clone or download button image](images/clone-download-btn.png)&nbsp; and download the project zip file or you can just click this button &nbsp;[![Download button image](images/download-btn.png)](https://github.com/go-0100-it/Neighborhood-Map-V2/archive/master.zip "Download project .zip file")&nbsp; to download the zipped files to your computer.

3. Unzip the file.

4. Using the command line navigate to the docs folder e.g.<br></br> 
`cd Neighborhood-Map-V2-master\Neighborhood-Map-V2-master\docs`<br></br> 

5. Within the docs folder start python's simple server by typing the command <br></br>
`python -m SimpleHTTPServer 8000`<br></br>
After a few seconds you should get the following message or similar in the command line <br></br>
`Serving HTTP on 0.0.0.0 port 8000 ...`

6. Lastly, open a web browser of your choice and type in the following URL<br></br>
`http://localhost:8000`
<br></br>
<hr></hr>

<a id="node-method"></a>
### **Node.js** - Simple HTTP Server method

1. You'll need Node installed to run this option.  If you don't have Node installed see [**here**](https://nodejs.org/) for the download and installation method. Once you have node installed you can proceed to step 2.

2. Install the http-server package from npm. [Installing with NPM](https://docs.npmjs.com/cli/install) Install the http-server globally on your machine using the node package manager (npm) command line tool, this will allow you to run a web server from anywhere on your computer. Open a command line window and enter the following:<br></br>
`npm install -g http-server`

2. On the Neighborhood Maps's [main repository page](https://github.com/go-0100-it/Neighborhood-Map-V2 "Go to main repository page") click &nbsp;![Clone or download button image](images/clone-download-btn.png)&nbsp; and download the project zip file or you can just click this button &nbsp;[![Download button image](images/download-btn.png)](https://github.com/go-0100-it/Neighborhood-Map-V2/archive/master.zip "Download project .zip file")&nbsp; to download the zipped files to your computer.

3. Unzip the file.

4. Using the command line navigate to the docs folder e.g.<br></br> 
`cd Neighborhood-Map-V2-master\Neighborhood-Map-V2-master\docs`<br></br> 

5. Within the docs folder start node's simple server by typing the command<br></br>
`http-server`<br></br>
After a few seconds you should get the following message or similar in the command line<br></br>
`Starting up http-server, serving ./`<br>
`Available on:`<br>
`  http://192.168.0.5:8080`<br>
`  http://127.0.0.1:8080`<br>
`Hit CTRL-C to stop the server`<br></br>


6. Lastly, open a web browser of your choice and type in the following URL<br></br>
`http://localhost:8080`