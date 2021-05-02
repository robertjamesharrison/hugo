function Spotify() {
    const [isClicked, setIsClicked] = React.useState(false);
    
    const getStats = async () => {
        setIsClicked(true);

        const response = await fetch("/.netlify/functions/spotify-login");

        console.log(response);
    }
  
    return (
      <div>
        <button onClick={getStats}>
          Get my stats
        </button>
        {isClicked && <div>Stats requested</div>}
      </div>
    );
  }
ReactDOM.render(React.createElement(Spotify),
    document.getElementById("spotifyApp"));