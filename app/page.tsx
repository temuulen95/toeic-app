import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import AppController from "@/components/AppController";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Show when="signed-in">
        <Header />
        <AppController />
      </Show>
      <Show when="signed-out">
        <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-amber-50 flex flex-col items-center justify-center gap-6 p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🥚</div>
            <h1 className="text-3xl font-bold text-amber-800 mb-2">EggLish</h1>
            <p className="text-amber-600 text-lg">TOEIC700点突破を目指す社会人向け英単語アプリ</p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <SignInButton mode="modal">
              <button className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl shadow-md transition-colors">
                ログイン
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="w-full py-3 px-6 bg-white hover:bg-amber-50 text-amber-700 font-semibold rounded-2xl shadow-md border border-amber-200 transition-colors">
                新規登録
              </button>
            </SignUpButton>
          </div>
        </div>
      </Show>
    </>
  );
}
