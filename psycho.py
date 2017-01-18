# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, Response, g, jsonify
from ast import literal_eval as parseJson
import MySQLdb as mdb
from db_info import mysql_conf, password
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
@app.route('/app3')
@app.route('/app3/game')
@app.route('/app3/history')
@app.route('/app4/game')
@app.route('/app4/history')
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
        test_id = request_data['testId']
        game_box_seq = request_data['gameBoxSeq']
        game_answers = request_data['gameAnswers']
        user_answers = request_data['userAnswers']
        corrects = request_data['corrects']
        expose = request_data['expose']
        blink = request_data['blink']
        interval = request_data['interval']
        # test_id = get_test_id('app1')
        data = [(test_id,
                 game_box_seq[i], game_answers[i], user_answers[i], corrects[i],
                 expose, blink, interval)
                for i in range(len(game_box_seq))]
        query = ('INSERT INTO app1 '
                 '(test_id, boxes, is_changed, user_input, correct, '
                 'expose, blink, inter) '
                 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s)')
        print data
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
        request_data = parseJson(request.data)
        if request_data['password'] == password:
            query = ('DELETE FROM app1')
            g.db.cursor().execute(query)
            g.db.commit()
            return Response(status=200)
        else:
            return Response(status=403)



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
        test_id = request_data['testId']
        game_seq = request_data['gameSeq']
        user_answers = request_data['userAnswers']
        delays = request_data['delays']
        # test_id = get_test_id('app2')
        data = [(test_id,
                 'ㅋ' if game_seq[i][1] == 'char' else '5',
                 game_seq[i][2], game_seq[i][0],
                 user_answers[i],
                 1 if user_answers[i] == game_seq[i][0] else 0,
                 delays[i]
                 )
                for i in range(len(game_seq))]
        print data
        query = ('INSERT INTO app2 '
                 '(test_id, letter, rotation, flip, '
                 'user_input, correct, delay) '
                 'VALUES (%s, %s, %s, %s, %s, %s, %s) ')
        g.db.cursor().executemany(query, data)
        g.db.commit()
        return jsonify(result='success')
    elif request.method == 'GET':
        query = ('SELECT '
                 'test_id, letter, rotation, flip, '
                 'user_input, correct, delay, ts '
                 'FROM app2 ')
        data = fetch_data(query)
        return jsonify(result=data)
    elif request.method == 'DELETE':
        request_data = parseJson(request.data)
        if request_data['password'] == password:
            query = ('DELETE FROM app2')
            g.db.cursor().execute(query)
            g.db.commit()
            return Response(status=200)
        else:
            return Response(status=403)


@app.route('/app2/download', methods=['GET'])
def app2Download():
    if request.method == 'GET':
        current_time_string = time.strftime('%Y-%m-%d %H:%M:%S')
        filename = ('app2(%s)' % current_time_string) + '.csv'
        header = ['test_id', 'letter', 'rotation', 'flip',
                  'user_input', 'correct', 'delay', 'timestamp']
        query = ('SELECT '
                 'test_id, letter, rotation, flip, '
                 'user_input, correct, delay, ts '
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


@app.route('/app3/result', methods=['POST', 'GET', 'DELETE'])
def app3Result():
    if request.method == 'POST':
        request_data = parseJson(request.data)
        test_id = request_data['testId']
        switch_seq = request_data['gameSwitchSeq']
        seq = request_data['gameSeq']
        types = request_data['gameTypes']
        answers = request_data['userAnswers']
        corrects = request_data['corrects']
        delays = request_data['delays']
        # test_id = get_test_id('app3')
        data = [(test_id,
                 seq[i][1], seq[i][0],
                 '양' if types[i] == 0 else '수',
                 'maintain' if switch_seq[i] == 0 else
                 'compatible' if switch_seq[i] == 1 else 'incompitible',
                 answers[i], corrects[i],
                 delays[i]
                 )
                for i in range(len(seq))]
        print data
        query = ('INSERT INTO app3 '
                 '(test_id, val, quant, game_type, '
                 'compatibility, user_input, correct, delay) '
                 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s) ')
        g.db.cursor().executemany(query, data)
        g.db.commit()
        return jsonify(result='success')
    elif request.method == 'GET':
        query = ('SELECT '
                 'test_id, val, quant, game_type, '
                 'compatibility, user_input, correct, delay, ts '
                 'FROM app3 ')
        data = fetch_data(query)
        return jsonify(result=data)
    elif request.method == 'DELETE':
        request_data = parseJson(request.data)
        if request_data['password'] == password:
            query = ('DELETE FROM app3')
            g.db.cursor().execute(query)
            g.db.commit()
            return Response(status=200)
        else:
            return Response(status=403)


@app.route('/app3/download', methods=['GET'])
def app3Download():
    if request.method == 'GET':
        current_time_string = time.strftime('%Y-%m-%d %H:%M:%S')
        filename = ('app3(%s)' % current_time_string) + '.csv'
        header = ['test_id', 'value', 'quantity', 'game_type', 'compatibility',
                  'user_input', 'correct', 'delay', 'timestamp']
        query = ('SELECT '
                 'test_id, val, quant, game_type, '
                 'compatibility, user_input, correct, delay, ts '
                 'FROM app3 ')
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


@app.route('/app4/result', methods=['POST', 'GET', 'DELETE'])
def app4Result():
    if request.method == 'POST':
        request_data = parseJson(request.data)
        test_id = request_data['testId']
        seq = request_data['seq']
        stop_seq = request_data['stopSeq']
        user_answers = request_data['userAnswers']
        corrects = request_data['corrects']
        delays = request_data['delays']
        fixation = request_data['fixation']
        blink = request_data['blink']
        wait = request_data['wait']
        # test_id = get_test_id('app4')
        data = [(test_id,
                 seq[i], stop_seq[i], user_answers[i], corrects[i], delays[i],
                 fixation, blink, wait)
                for i in range(len(seq))]
        print data
        query = ('INSERT INTO app4 '
                 '(test_id, location, stop, user_input, correct, delay, '
                 'fixation, blink, wait) '
                 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)')
        g.db.cursor().executemany(query, data)
        g.db.commit()
        return jsonify(result='success')
    elif request.method == 'GET':
        query = ('SELECT '
                 'test_id, location, stop, user_input, correct, delay, '
                 'fixation, blink, wait, ts '
                 'FROM app4 ')
        data = fetch_data(query)
        return jsonify(result=data)
    elif request.method == 'DELETE':
        request_data = parseJson(request.data)
        if request_data['password'] == password:
            query = ('DELETE FROM app4')
            g.db.cursor().execute(query)
            g.db.commit()
            return Response(status=200)
        else:
            return Response(status=403)


@app.route('/app4/download', methods=['GET'])
def app4Download():
    if request.method == 'GET':
        current_time_string = time.strftime('%Y-%m-%d %H:%M:%S')
        filename = ('app4(%s)' % current_time_string) + '.csv'
        header = ['test_id',
                  'location', 'stop_signal', 'user_input', 'is_correct', 'delay',
                  'fixation', 'blink', 'wait', 'timestamp']
        query = ('SELECT '
                 'test_id, location, stop, user_input, correct, delay, '
                 'fixation, blink, wait, ts '
                 'FROM app4 ')
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
