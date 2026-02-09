import * as migration_20260209_074151_add_custom_label_and_schema_changes from './20260209_074151_add_custom_label_and_schema_changes';

export const migrations = [
  {
    up: migration_20260209_074151_add_custom_label_and_schema_changes.up,
    down: migration_20260209_074151_add_custom_label_and_schema_changes.down,
    name: '20260209_074151_add_custom_label_and_schema_changes'
  },
];
