import json

def is_five_letters(word): 
    if len(word) == 5:
        return word

def has_special_chars(word): 
    if '-' not in word and '.' not in word and '\'' not in word:
        return word

def format_word(word): 
    formatted_word = word.lower()
    return formatted_word

def load_words():
    with open('ALL_WORDS.txt') as word_file:
        valid_words = set(word_file.read().split()) ## Read File
        five_letter_words = filter(is_five_letters, valid_words)  # Filter out five letter words
        no_special_chars = filter(has_special_chars, five_letter_words) # filter out special chars
        final_words = map(format_word , no_special_chars) # to lower case
        
    return final_words



if __name__ == '__main__':
    words = load_words()
    # demo print
    # print(words)
    json_object = json.dumps(words, indent = 4)
  
# Writing to file
with open("WORDLIST.json", "w") as outfile:
    outfile.write(json_object)

