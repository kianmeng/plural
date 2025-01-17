defmodule Core.Clients.OpenAI do
  require Logger

  @options [recv_timeout: :infinity, timeout: :infinity]

  defmodule Choice, do: defstruct [:text, :index, :logprobs]

  defmodule CompletionResponse do
    alias Core.Clients.OpenAI
    defstruct [:id, :object, :model, :choices]

    def spec(), do: %__MODULE__{choices: [%OpenAI.Choice{}]}
  end

  def completion(model, prompt) do
    body = Jason.encode!(%{
      model: model,
      prompt: String.trim(prompt),
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
    })

    url("/completions")
    |> HTTPoison.post(body, json_headers(), @options)
    |> handle_response(CompletionResponse.spec())
  end

  defp handle_response({:ok, %HTTPoison.Response{status_code: code, body: body}}, type) when code in 200..299,
    do: {:ok, Poison.decode!(body, as: type)}
  defp handle_response(error, _) do
    Logger.error "Failed to call openai api: #{inspect(error)}"
    {:error, :openai_error}
  end

  defp url(path), do: "https://api.openai.com/v1#{path}"

  defp json_headers(), do: headers([{"Content-Type", "application/json"}])

  defp headers(headers \\ []), do: [{"Authorization", "Bearer #{token()}"} | headers]

  defp token(), do: Core.conf(:openai_token)
end
