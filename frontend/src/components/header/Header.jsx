import "./header.css";

export default function Header() {
  return (
    <div className="header">
      <div className="headerTitles">
        <span className="headerTitleSm">React & node</span>
        <span className="headerTitleLg">Blogg</span>
      </div>
      <img
        className="headerImg"
        src="https://www.enjpg.com/img/2020/tall-mountain-6.jpg"
        alt=""
      />
    </div>
  );
}
