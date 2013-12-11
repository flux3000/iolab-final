UFO-IO
===========

Final Project for UC Berkeley IO Lab Fall 2013
------------
UFO-IO contains the largest, most comprehensive dataset of UFO sightings in existence, and lets users explores the data in a whole new context. In the main chart view, UFO-IO presents a month-by-month breakdown of every reported UFO sighting from 1981-2012. Users can choose to view the details of a month's reports, and view all the results on a map as well. UFO-IO's timeline lays out an array of space-related world events, astronomical phenomena, and alien/UFO-related movies, allowing for some real-world context for UFO sighting trends around the time the world was exposed to these events.

Team members and roles
------------
Ryan Baker - D3, jQuery, CSS, Overall Layout Design
Ashley DeSouza - D3, jQuery, CSS, Google Maps
Tom Quast - D3, Scraped the Data, Built the Database
Victor Starostenko - D3, jQuery, CSS, Graphic Design, Data Acquisition

Technologies used
------------
jQuery, JavaScript, PHP, MySQL, d3.js, Google Maps API, Google Geolocation API

Link to demo version
------------
http://ufo.quast.li

Known bugs
------------
- The dataset we scraped was dirty, so some of the cities were unrecognizable by Google's Geolocation, so they do not have lat/long coordinates.
- If the user clicks on several timeline items in succession, the code which highlights the corresponding svg bar and places the marker does not work for some reason. Upon page refresh it begins working again.

Credits
------------
UFO sighting data obtained from uforc.org
