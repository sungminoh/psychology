import time


headers = {
    'visual_working_memory': ['test_id',
                              'number_of_boxes', 'is_changed', 'user_input', 'is_correct',
                              'expose', 'blink', 'inter', 'timestamp'],
    'mental_rotation': ['test_id', 'letter', 'rotation', 'flip',
                        'user_input', 'correct', 'delay', 'timestamp'],
    'task_switching': ['test_id', 'value', 'quantity', 'game_type', 'compatibility',
                       'user_input', 'correct', 'delay', 'timestamp'],
    'stop_signal_task': ['test_id',
                         'location', 'stop_signal', 'user_input', 'correct', 'delay',
                         'fixation', 'blink', 'wait', 'timestamp'],
    'nback': ['test_id',
              'game_seq', 'number_seq', 'nback_type', 'number', 'hit', 'user_input', 'correct',
              'expose', 'blink', 'timestamp']
}


class DownloadManager(object):
    @staticmethod
    def get_filename(table):
        current_time_string = time.strftime('%Y-%m-%d_%H:%M:%S')
        filename = '%s.%s.csv' % (table, current_time_string)
        return filename

    @staticmethod
    def get_csv(table, data):
        header = headers.get(table)
        csv_data = [','.join(header)]
        csv_data.extend([','.join(str(x) for x in entity) for entity in data])
        csv_text = '\n'.join(csv_data)
        return csv_text
