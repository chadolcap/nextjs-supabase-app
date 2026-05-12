# Claude Code Stop Hook
# 작업 완료 시 Slack 앱으로 알림 전송

$webhookUrl = $env:SLACK_WEBHOOK_URL
if (-not $webhookUrl) {
    exit 0
}

$projectName = Split-Path $env:CLAUDE_PROJECT_DIR -Leaf
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$payload = @{
    blocks = @(
        @{
            type = "header"
            text = @{
                type = "plain_text"
                text = "✅ Claude Code 작업 완료"
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
                    text = "*완료 시각:*`n$timestamp"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $payload -ContentType "application/json" | Out-Null
} catch {
    # 훅 실패가 Claude Code 작업을 방해하지 않도록 오류 무시
}
