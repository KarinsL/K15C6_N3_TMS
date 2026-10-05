import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 16px' }}>
      <h1>404</h1>
      <p>Không tìm thấy trang.</p>
      <Link to="/">Về trang chủ</Link>
    </main>
  )
}

export default NotFoundPage
