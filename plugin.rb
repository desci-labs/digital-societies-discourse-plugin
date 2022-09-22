# frozen_string_literal: true

# name: desoc-badges
# about: A discourse plugin to display users desoc badges
# version: 0.0.1
# authors: Desci Labs
# url: https://desci.com
# required_version: 2.7.0

enabled_site_setting :desoc_badges_enabled

register_asset "stylesheets/common.scss"

after_initialize do
end
