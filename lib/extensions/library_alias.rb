module Middleman::Sitemap
  class AliasResource < ::Middleman::Sitemap::Resource
    def initialize(store, path, alias_path)
      @alias_path = alias_path
      super(store, "library/#{path}")
    end
  end
end
