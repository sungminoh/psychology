# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, Response, g, jsonify
from ast import literal_eval as parseJson
# import MySQLdb as mdb
# from db_info import mysql_conf, password
import sqlite3
# from pdb import set_trace as bp
import time
from data.database_manager import DatabaseManager
from utils.download_manager import DownloadManager


app = Flask(__name__, static_url_path='/static', static_folder='static')


@app.before_request
def before_request():
    g.db = DatabaseManager('./data/db.sqlite3')
    g.down = DownloadManager


@app.teardown_request
def teardown_request(exception):
    g.db.close()


@app.route('/')
@app.route('/visual_working_memory')
@app.route('/mental_rotation')
@app.route('/task_switching')
@app.route('/stop_signal_task')
@app.route('/game/visual_working_memory')
@app.route('/game/mental_rotation')
@app.route('/game/task_switching')
@app.route('/game/stop_signal_task')
@app.route('/history/visual_working_memory')
@app.route('/history/mental_rotation')
@app.route('/history/task_switching')
@app.route('/history/stop_signal_task')
def index():
    return render_template('index.html')


class PostRequestHandler(object):
    @staticmethod
    def visual_working_memory(request):
        request_data = parseJson(request.data)
        test_id = request_data['testId']
        game_box_seq = request_data['gameBoxSeq']
        game_answers = request_data['gameAnswers']
        user_answers = request_data['userAnswers']
        corrects = request_data['corrects']
        expose = request_data['expose']
        blink = request_data['blink']
        interval = request_data['interval']
        data = [(test_id,
                game_box_seq[i], game_answers[i], user_answers[i], corrects[i],
                expose, blink, interval)
                for i in range(len(game_box_seq))]
        g.db.insert(table, data)

    @staticmethod
    def mental_rotation(request):
        request_data = parseJson(request.data)
        test_id = request_data['testId']
        game_seq = request_data['gameSeq']
        user_answers = request_data['userAnswers']
        delays = request_data['delays']
        data = [(test_id,
                 'ㅋ' if game_seq[i][1] == 'char' else '5',
                 game_seq[i][2], game_seq[i][0],
                 user_answers[i],
                 1 if user_answers[i] == game_seq[i][0] else 0,
                 delays[i]
                 )
                for i in range(len(game_seq))]
        g.db.insert(table, data)

    @staticmethod
    def task_switching(request):
        request_data = parseJson(request.data)
        test_id = request_data['testId']
        switch_seq = request_data['gameSwitchSeq']
        seq = request_data['gameSeq']
        types = request_data['gameTypes']
        answers = request_data['userAnswers']
        corrects = request_data['corrects']
        delays = request_data['delays']
        # test_id = get_test_id('task_switching')
        data = [(test_id,
                 seq[i][1], seq[i][0],
                 '양' if types[i] == 0 else '수',
                 'maintain' if switch_seq[i] == 0 else
                 'compatible' if switch_seq[i] == 1 else 'incompitible',
                 answers[i], corrects[i],
                 delays[i]
                 )
                for i in range(len(seq))]
        g.db.insert(table, data)

    @staticmethod
    def stop_signal_task(request):
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
        data = [(test_id,
                 seq[i], stop_seq[i], user_answers[i], corrects[i], delays[i],
                 fixation, blink, wait)
                for i in range(len(seq))]

    @staticmethod
    def nback(request):
        request_data = parseJson(request.data)
        test_id = request_data['testId']


@app.route('/download/<table>', methods=['GET'])
def download(table):
    data = g.db.download(table)
    filename = g.down.get_filename(table)
    csv_text = g.down.get_csv(table, data)
    return Response(csvText,
                    mimetype='text/csv',
                    headers={
                        'Content-disposition':
                        'attachment; filename=%s' % filename
                    })


@app.route('/result/<table>', methods=['POST', 'GET', 'DELETE'])
def result():
    if request.method == 'POST':
        getattr(PostRequestHandler, table)(request)
        return jsonify(result='success')
    elif request.method == 'GET':
        return jsonify(result=g.db.select(table))
    elif request.method == 'DELETE':
        request_data = parseJson(request.data)
        if request_data['password'] == password:
            g.db.delete(table)
            return Response(status=200)
        else:
            return Response(status=403)


if __name__ == '__main__':
    app.run(debug=True)
