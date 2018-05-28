# Switcheroo
Import your personal libraries from streaming services to Spotify!

<h3>A free service packed in a Chrome Extension</h3>
This is a chrome extension under development. <br>
<p>It currently supports, exporting your library from Google Play Music to Spotify. It can be found <a href="https://chrome.google.com/webstore/detail/switcheroo/pnmhhafmkpbmbiibonckcnomganolpfa">here<a>.</p>
<br>
Support for more streaming services coming soon.<br>

<b>Services Available</b><br>
[#] Google Play Music<br>

<b>Coming Soon</b> <br>
[] Saavn<br>
[] Gaana<br>
[] Apple Music<br>
[] many more..

<br><br>

<b>Developers</b>
<p>
	To get started, create an account on Spotify and sign up as a Spotify Developer. Use the developer dashboard to create a dev app, and generate the client id and client key.<br>
	Create a config.js and store the client key and id in the format shown below:
</p>

<code>
	var config = {
  		CLIENT_ID : 'abcdefghisdjk23434234234',
  		CLIENT_SECRET : 'abcdegkjdlfkjdlfkj2343424'
	}
</code>


<p>
	This file will be read by the JS automatically when compiling the app.
</p>