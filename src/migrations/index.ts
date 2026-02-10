import * as migration_20260209_074151_add_custom_label_and_schema_changes from './20260209_074151_add_custom_label_and_schema_changes';
import * as migration_20260210_030042_bio_to_richtext from './20260210_030042_bio_to_richtext';

export const migrations = [
  {
    up: migration_20260209_074151_add_custom_label_and_schema_changes.up,
    down: migration_20260209_074151_add_custom_label_and_schema_changes.down,
    name: '20260209_074151_add_custom_label_and_schema_changes',
  },
  {
    up: migration_20260210_030042_bio_to_richtext.up,
    down: migration_20260210_030042_bio_to_richtext.down,
    name: '20260210_030042_bio_to_richtext'
  },
];
