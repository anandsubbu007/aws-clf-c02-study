import { Link } from 'react-router-dom';

export function NotFound({ what = 'page' }: { what?: string }) {
  return (
    <div className="empty">
      <h1>We couldn’t find that {what}</h1>
      <p>The link may be outdated. Try the course outline or search.</p>
      <p>
        <Link className="btn btn-primary" to="/learn">
          Open the course
        </Link>
      </p>
    </div>
  );
}
