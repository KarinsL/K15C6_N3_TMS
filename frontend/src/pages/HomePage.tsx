import { useEffect, useState } from 'react'
import { getHealth } from '../api/health'

type ApiState = 'loading' | 'up' | 'down'

function HomePage() {
  const [apiState, setApiState] = useState<ApiState>('loading')

  useEffect(() => {
    getHealth()
      .then((res) => setApiState(res.status === 'UP' ? 'up' : 'down'))
      .catch(() => setApiState('down'))
  }, [])

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 16px' }}>
      <h1>Training Management System</h1>
      <p>Hệ thống Quản lý Đào tạo — K15C6 N3</p>
      <p>
        Backend API:{' '}
        <strong>
          {apiState === 'loading' && 'đang kiểm tra...'}
          {apiState === 'up' && 'đang chạy'}
          {apiState === 'down' && 'không kết nối được'}
        </strong>
      </p>
    </main>
  )
}

export default HomePage
