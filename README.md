![Static-Site-Stealer](https://socialify.git.ci/FireStreaker2/Static-Site-Stealer/image?description=1&font=Raleway&forks=1&issues=1&language=1&name=1&owner=1&pulls=1&stargazers=1&theme=Dark)

# Info
Static Site Stealer is a simple node program to "steal" static sites. It accomplishes this by fetching the HTML for a URL on the server, and then sends an exact copy of it to the client. It comes with three different routes, all with their own purposes.

# Usage
There are three current routes. A table is shown below for their usage.
| Route               | Usage                                                                                                            |
| --------------------|------------------------------------------------------------------------------------------------------------------|
| /search/${url}      | The actual recommended "static site stealer", renders static sites by rewriting relative urls into absolute ones
| /simple/${url}      | Like ``/search``, but usually renders only the HTML (no url rewriting)                                           |
| /iframe/${url}      | A simple iframe for the site.                                                                                    |

> Note that the url variable will be the site WITHOUT the protocol added (ex. ``/search/firestreaker2.gq``)

# Selfhosting
If you want to selfhost this project for some reason, you are free to do so.
```bash
$ git clone https://github.com/FireStreaker2/Static-Site-Stealer.git
$ cd Static-Site-Stealer
$ npm i
$ npm start
```

# License
<a href="https://github.com/FireStreaker2/Static-Site-Stealer/blob/main/LICENSE">MIT</a>