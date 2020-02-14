defmodule Watchman.Services.Base do
  defmacro __using__(_) do
    quote do
      import Watchman.Services.Base
      alias Watchman.Repo
    end
  end

  def when_ok({:ok, resource}, :insert), do: Watchman.Repo.insert(resource)
  def when_ok({:ok, resource}, :update), do: Watchman.Repo.update(resource)
  def when_ok({:ok, resource}, :delete), do: Watchman.Repo.delete(resource)
  def when_ok({:ok, resource}, fun) when is_function(fun) do
    case fun.(resource) do
      {:ok, res} -> {:ok, res}
      {:error, error} -> {:error, error}
      res -> {:ok, res}
    end
  end
  def when_ok(error, _), do: error
end