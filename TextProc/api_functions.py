from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import wordnet
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
import string
from collections import Counter
import nltk
import gensim

def get_part_of_speech(word):
  probable_part_of_speech = wordnet.synsets(word)

  pos_counts = Counter()

  pos_counts["n"] = len(  [ item for item in probable_part_of_speech if item.pos()=="n"]  )
  pos_counts["v"] = len(  [ item for item in probable_part_of_speech if item.pos()=="v"]  )
  pos_counts["a"] = len(  [ item for item in probable_part_of_speech if item.pos()=="a"]  )
  pos_counts["r"] = len(  [ item for item in probable_part_of_speech if item.pos()=="r"]  )

  most_likely_part_of_speech = pos_counts.most_common(1)[0][0]
  return most_likely_part_of_speech

def tokens(text):

    phrases = sent_tokenize(text)
    tokenized_sents = [word_tokenize(i.lower()) for i in phrases]
    tokenized_sents
    return tokenized_sents

def clean(text):
    tokenized_sents = tokens(text)
    final = []
    lemmatizer = WordNetLemmatizer()
    stops = nltk.corpus.stopwords.words('english')
    exclude = set(string.punctuation)
    for sentence in tokenized_sents:
        stop_free = [i for i in sentence if i not in stops]
        punc_free = [ch for ch in stop_free if ch not in exclude]
        lemmatized = [lemmatizer.lemmatize(w, get_part_of_speech(w)) for w in punc_free]
        final.extend([lemmatized])
    return final

def bow(wordlist):
    all_words = sum(wordlist, [])
    return(nltk.FreqDist(w for w in all_words))

def finalbow(text):
    text = clean(text)
    freq = dict(bow(text))
    elaborate = []
    for key,value in dict(freq).items():
        elaborate.append({'word': key, 'frequency':value})
    return elaborate

def WordVec(text, word):
    model = gensim.models.Word2Vec(clean(text), min_count=1)
    similars = model.wv.most_similar(word, topn=5)
    similar_words = []
    for similar in similars:
        similar_words.append({'word':similar[0], 'value': similar[1]})
    return similar_words
