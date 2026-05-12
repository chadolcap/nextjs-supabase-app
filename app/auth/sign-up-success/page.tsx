import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                회원가입 완료!
              </CardTitle>
              <CardDescription>이메일 확인이 필요합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                회원가입이 완료되었습니다. 가입에 사용한 이메일 주소로 확인 링크가 발송되었습니다.
              </p>

              <div className="space-y-2 bg-blue-50 dark:bg-blue-950 p-3 rounded text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-200">📧 다음 단계:</p>
                <ol className="list-decimal list-inside text-blue-800 dark:text-blue-300 space-y-1">
                  <li>받은 이메일 확인</li>
                  <li>&quot;Confirm your email&quot; 링크 클릭</li>
                  <li>로그인 페이지에서 로그인</li>
                </ol>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  이메일을 받지 못하셨나요?
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 스팸 폴더 확인</li>
                  <li>• 이메일 주소 재확인</li>
                </ul>
              </div>

              <Button asChild className="w-full">
                <Link href="/auth/login">로그인 페이지로</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
