defmodule WatchmanWeb.WebhookControllerTest do
  use WatchmanWeb.ConnCase
  import Mock

  describe "#webhook/2" do
    test "it'll succeed if the signature is valid", %{conn: conn} do
      path   = Routes.webhook_path(conn, :webhook)
      secret = Watchman.conf(:webhook_secret)
      body   = Jason.encode!(%{repo: "chartmart"})
      myself = self()

      with_mock Watchman.Deployer, [deploy: fn repo ->
        send myself, {:deploy, repo}
        :ok
      end] do
        conn
        |> put_req_header("x-watchman-signature", "sha1=#{Watchman.hmac(secret, body)}")
        |> put_req_header("content-type", "application/json")
        |> post(path, body)
        |> json_response(200)

        assert_receive {:deploy, "chartmart"}
      end
    end

    test "It will fail on invalid signatures", %{conn: conn} do
      path = Routes.webhook_path(conn, :webhook)
      body = Jason.encode!(%{repo: "chartmart"})

      conn
      |> put_req_header("x-watchman-signature", "sha1=bogus")
      |> put_req_header("content-type", "application/json")
      |> post(path, body)
      |> response(403)
    end
  end
end