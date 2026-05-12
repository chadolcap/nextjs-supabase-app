# Claude Code Notification Hook
# 권한 요청 시 Slack 앱으로 알림 전송

$webhookUrl = $env:SLACK_WEBHOOK_URL
if (-not $webhookUrl) {
    exit 0
}

# stdin에서 이벤트 데이터 읽기
$stdinContent = $null
if ([Console]::In.Peek() -ne -1) {
    $stdinContent = [Console]::In.ReadToEnd()
}

$message = "Claude Code 알림"
if ($stdinContent) {
    try {
        $data = $stdinContent | ConvertFrom-Json
        if ($data.message) {
            $message = $data.message
        }
    } catch { }
}

$projectName = Split-Path $env:CLAUDE_PROJECT_DIR -Leaf
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$payload = @{
    blocks = @(
        @{
            type = "header"
            text = @{
                type = "plain_text"
                text = "🔔 Claude Code 권한 요청"
            }
        }
        @{
            type = "section"
            fields = @(
                @{
                    type = "mrkdwn"
                    text = "*프로젝트:*`n$projectName"
                }
                @{
                    type = "mrkdwn"
                    text = "*시각:*`n$timestamp"
                }
            )
        }
        @{
            type = "section"
            text = @{
                type = "mrkdwn"
                text = "*메시지:*`n$message"
            }
        }
    )
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $payload -ContentType "application/json" | Out-Null
} catch {
    # 훅 실패가 Claude Code 작업을 방해하지 않도록 오류 무시
}
