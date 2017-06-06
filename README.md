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

<a id="run-application"></a>

## To run this application &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [` ^ `](#top "Go to top of page")

1. On the [main repository page](https://github.com/go-0100-it/Neighborhood-Map-V2 "Go to main repository page") click &nbsp;![Clone or download button image](images/clone-download-btn.png)&nbsp; and download the project zip file or you can just click this button &nbsp;[![Download button image](images/download-btn.png)](https://github.com/go-0100-it/Neighborhood-Map-V2/archive/master.zip "Download project .zip file")&nbsp; to download the zipped files to your computer.

2. Unzip the file.

3. Browse to the docs folder located at<br></br> 
`Neighborhood-Map-V2-master\Neighborhood-Map-V2-master\docs`<br></br> 
and locate the `index.html` file.

4. Open `index.html` in the browser of your choice.

### Or you can view the GitHub hosted version of the [**Web App**](https://go-0100-it.github.io/Neighborhood-Map-V2/).
<br></br>