defmodule GraphQl.Schema.Misc do
  use GraphQl.Schema.Base

  import_types Absinthe.Type.Custom
  import_types GraphQl.Schema.CustomTypes

  enum :direction do
    value :before
    value :after
  end

  input_object :tag_attributes do
    field :tag, non_null(:string)
  end

  object :closure do
    field :helm, list_of(:chart)
    field :terraform, list_of(:terraform)
  end

  object :tag do
    field :id,  non_null(:id)
    field :tag, non_null(:string)
  end

  enum :tag_group do
    value :integrations
    value :repositories
  end

  object :grouped_tag do
    field :tag,   non_null(:string)
    field :count, non_null(:integer)
  end

  connection node_type: :grouped_tag
end