def convert_to_float_rec(data):
    if hasattr(data, '__iter__'):
        return map(convert_to_float_rec, data)
    else:
        try:
            float_data = float(data)
            return float_data
        except:
            return data
