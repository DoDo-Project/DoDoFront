import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-4 p-6 text-center text-neutral-600">
      <p>소셜 로그인 (뼈대)</p>
      {import.meta.env.DEV ? (
        <Link to="/auth/signup?preview=1" className="text-sm text-brand underline">
          회원가입 UI 미리보기 (dev)
        </Link>
      ) : null}
    </div>
  );
}
