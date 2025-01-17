import { RegisterForm } from "@/components/auth/RegisterForm"
import { Card } from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">アカウント作成</h2>
          <p className="mt-2 text-sm text-gray-600">
            新規アカウントを作成して買い物を始めましょう
          </p>
        </div>
        <RegisterForm />
      </Card>
    </div>
  )
}