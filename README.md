UFO-IO
===========

Final Project for UC Berkeley IO Lab Fall 2013
------------
UFO-IO contains the largest, most comprehensive dataset of UFO sightings in existence, and lets users explores the data in a whole new context. In the main chart view, UFO-IO presents a month-by-month breakdown of every reported UFO sighting from 1981-2012. Users can choose to view the details of a month's reports, and view all the results on a map as well. UFO-IO's timeline lays out an array of space-related world events, astronomical phenomena, and alien/UFO-related movies, allowing for some real-world context for UFO sighting trends around the time the world was exposed to these events.

Presented in a visually-stimulating layout, UFO-IO provies a new way to look at UFO data, and perhaps gain some insight into world and astrological
Finally, to make fetching the data easier we have programmed an API which we have made publicly available. 

Team members and roles
------------
Ryan Baker - D3, jQuery, CSS, Overall Layout Design
Ashley DeSouza - D3, jQuery, CSS, Google Maps
Tom Quast - D3, Scraped the Data, Built the Database, wrote the API
Victor Starostenko - D3, jQuery, CSS, Graphic Design, Data Acquisition

Technologies used
------------
jQuery, JavaScript, PHP, MySQL, d3.js, Google Maps API, Mapquest Geolocation API

Link to demo version
------------
http://ufo.quast.li

Link to the API
------------
http://ufo.quast.li/backend


Known bugs
------------
- The dataset we scraped is dirty, all data is entered through text-fields, so was no validation is done. This led to a number of challenges, especially when trying to locate the cities. We used Mapquests best guess for the data, it returned something for >99,9 of the cases, but it might be off.
- If the user clicks on several timeline items in succession, the code which highlights the corresponding svg bar and places the marker does not work for some reason. Upon page refresh it begins working again.

Credits
------------
UFO sighting data obtained from uforc.org
