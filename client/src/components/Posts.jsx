import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import Image from "./Image.jsx";

export default function Posts({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
}) {
  // console.log(author);
  return (
    <div className="post">
      <div className="post-info">
        <div className="post-head">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>

          <a href="" className="post-author">
            {author.userName}
          </a>
          <time>{createdAt ? formatISO9075(new Date(createdAt)) : "N/A"}</time>
        </div>

        <div className="post-imgdiv">
          <Link to={`/post/${_id}`}>
            <Image src={cover} alt="" />
          </Link>
        </div>
      </div>

      <div className="post-description">
        <p>{summary}</p>
      </div>
    </div>
  );
}
