import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section>
            <h2>Page not found</h2>
            <p>The page you are looking for does not exist.</p>
            <p style={{ marginTop: 12 }}>
                <Link to="/">Go to dashboard</Link>
            </p>
        </section>
    );
}
