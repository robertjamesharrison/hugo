function Spotify() {
    const [isClicked, setIsClicked] = React.useState(false);
    
    const getStats = async () => {
        setIsClicked(true);

        const response = await fetch("/.netlify/functions/spotify-login");

        console.log(response);

        const data = await response.json();

        console.log(data);
    }
  
    return (
      <div>
        <a href="/.netlify/functions/spotify-login">
          Get my stats
        </a>
        {isClicked && <div>Stats requested</div>}
      </div>
    );
  }
ReactDOM.render(React.createElement(Spotify),
    document.getElementById("spotifyApp"));