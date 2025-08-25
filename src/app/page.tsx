export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">Welcome to E-Voting System</h1>
      <p className="text-gray-600">
        Pilih pemimpinmu secara online dengan aman.
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Login
        </a>
        <a href="/register" className="px-4 py-2 bg-gray-200 rounded-lg">
          Register
        </a>
      </div>
    </div>
  );
}
