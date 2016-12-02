# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, Response, g, jsonify
from ast import literal_eval as parseJson
import MySQLdb as mdb
from db_info import mysql_conf
from pdb import set_trace as bp
import time


app = Flask(__name__, static_url_path='/static', static_folder='static')


@app.before_request
def before_request():
    g.db = mdb.connect(**mysql_conf())


@app.teardown_request
def teardown_request(exception):
    g.db.close()


@app.route('/')
@app.route('/app1')
@app.route('/app1/game')
@app.route('/app1/history')
@app.route('/app2')
@app.route('/app2/game')
@app.route('/app2/history')
def index():
    return render_template('index.html')


def get_test_id(table):
    cur = g.db.cursor()
    cur.execute('SELECT MAX(test_id) FROM %s' % table)
    max_test_id = cur.fetchone()[0]
    return max_test_id+1 if max_test_id is not None else 1


def convert_to_float_rec(data):
    if hasattr(data, '__iter__'):
        return map(convert_to_float_rec, data)
    else:
        try:
            float_data = float(data)
            return float_data
        except:
            return data


def fetch_data(query, params=None):
    cur = g.db.cursor()
    if params:
        query = query % tuple(params)
    cur.execute(query)
    return convert_to_float_rec(cur.fetchall())


@app.route('/app1/result', methods=['POST', 'GET', 'DELETE'])
def app1Result():
    if request.method == 'POST':
        request_data = parseJson(request.data)
        game_box_seq = request_data['gameBoxSeq']
        game_answers = request_data['gameAnswers']
        user_answers = request_data['userAnswers']
        corrects = request_data['corrects']
        expose = request_data['expose']
        blink = request_data['blink']
        interval = request_data['interval']
        test_id = get_test_id('app1')
        data = [(test_id,
                 game_box_seq[i], game_answers[i], user_answers[i], corrects[i],
                 expose, blink, interval)
                for i in range(len(game_box_seq))]
        query = ('INSERT INTO app1 '
                 '(test_id, boxes, is_changed, user_input, correct, '
                 'expose, blink, inter) '
                 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s)')
        g.db.cursor().executemany(query, data)
        g.db.commit()
        return jsonify(result='success')
    elif request.method == 'GET':
        query = ('SELECT '
                 'test_id, boxes, is_changed, user_input, correct, '
                 'expose, blink, inter, ts '
                 'FROM app1 ')
        data = fetch_data(query)
        return jsonify(result=data)
    elif request.method == 'DELETE':
        query = ('DELETE FROM app1')
        g.db.cursor().execute(query)
        g.db.commit()
        return jsonify(result='success')


@app.route('/app1/download', methods=['GET'])
def app1Download():
    if request.method == 'GET':
        current_time_string = time.strftime('%Y-%m-%d %H:%M:%S')
        filename = ('app1(%s)' % current_time_string) + '.csv'

        header = ['test_id',
                  'number_of_boxes', 'is_changed', 'user_input', 'is_correct',
                  'expose', 'blink', 'inter', 'timestamp']
        query = ('SELECT '
                 'test_id, boxes, is_changed, user_input, correct, '
                 'expose, blink, inter, ts '
                 'FROM app1 ')
        data = fetch_data(query)
        csvData = [','.join(header)]
        csvData.extend([','.join(str(x) for x in entity) for entity in data])
        csvText = '\n'.join(csvData)
        return Response(csvText,
                        mimetype='text/csv',
                        headers={
                            'Content-disposition':
                            'attachment; filename=%s' % filename
                        })


@app.route('/app2/result', methods=['POST', 'GET', 'DELETE'])
def app2Result():
    if request.method == 'POST':
        request_data = parseJson(request.data)
        game_seq = request_data['gameSeq']
        user_answers = request_data['userAnswers']
        test_id = get_test_id('app2')
        data = [(test_id,
                 'ㅋ' if game_seq[i][1] == 'char' else '5',
                 game_seq[i][2], game_seq[i][0],
                 user_answers[i],
                 1 if user_answers[i] == game_seq[i][0] else 0)
                for i in range(len(game_seq))]
        query = ('INSERT INTO app2 '
                 '(test_id, letter, rotation, flip, '
                 'user_input, correct) '
                 'VALUES (%s, %s, %s, %s, %s, %s) ')
        g.db.cursor().executemany(query, data)
        g.db.commit()
        return jsonify(result='success')
    elif request.method == 'GET':
        query = ('SELECT '
                 'test_id, letter, rotation, flip, '
                 'user_input, correct, ts '
                 'FROM app2 ')
        data = fetch_data(query)
        return jsonify(result=data)
    elif request.method == 'DELETE':
        query = ('DELETE FROM app2')
        g.db.cursor().execute(query)
        g.db.commit()
        return jsonify(result='success')


@app.route('/app2/download', methods=['GET'])
def app2Download():
    if request.method == 'GET':
        current_time_string = time.strftime('%Y-%m-%d %H:%M:%S')
        filename = ('app2(%s)' % current_time_string) + '.csv'
        header = ['test_id', 'letter', 'rotation', 'flip',
                  'user_input', 'correct', 'timestamp']
        query = ('SELECT '
                 'test_id, letter, rotation, flip, '
                 'user_input, correct, ts '
                 'FROM app2 ')
        data = fetch_data(query)
        csvData = [','.join(header)]
        csvData.extend([','.join(str(x) for x in entity) for entity in data])
        csvText = '\n'.join(csvData)
        return Response(csvText,
                        mimetype='text/csv',
                        headers={
                            'Content-disposition':
                            'attachment; filename=%s' % filename
                        })


if __name__ == '__main__':
    app.run(debug=True)
