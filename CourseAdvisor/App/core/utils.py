def parseResponse(response):
    context = {}
    for answer_dict in response['question']['answers']:
        text = answer_dict['text'].split('-')
        id = text[0].strip()
        header = ''
        h1 = ''
        if len(text) > 1:
            header = text[1].split(' : ')
            h1 = header[0].strip()
        h2 = ''
        if len(header) > 1:
            h2 = header[1].strip()
        reason = ''
        value = 0.0
        for evidence in response['question']['evidencelist']:
            if id in evidence['id']:
                reason = evidence['text']
                value = float(evidence['value'])
                break
        if h1 in context:
            if h2 in context[h1]:
                context[h1][h2] += '; ' + reason
            else:
                context[h1][h2] = reason
            if value > context[h1]['value']:
                context[h1]['value'] = value
        else:
            context[h1] = {h2: reason, 'value': value}

    result = []
    for k, v in context.items():
        tmp = {}
        tmp['Course'] = k
        tmp['reason'] = []
        value = v['value']
        for title, reason in v.items():
            if title != 'value':
                tmp['reason'].append((title, reason))
        result.append((tmp, value))

    result.sort(key=lambda x: x[1])
    result.reverse()
    return response, result
