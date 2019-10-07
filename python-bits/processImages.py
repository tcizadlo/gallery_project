import os
from slugify import slugify
import numpy as np
import cv2
import imutils
directoryName = "/Users/tcizadlo/raw-gallery-test/"
imageNames = open(directoryName+"PictureNames.txt", "r")
#captions = open("captions.txt", "r")
# seperate file name and directory so that local directory names can be in jsfile
galleryName = "gallery-test2"
imgNameArray = imageNames.readlines();
#captionsArray = captions.readlines();
tempResizedName = ""
tempThumbName = ""
import subprocess
def rreplace(s, old):
	k = old.rfind(s)
	new = old[:k] + "." + old[k+1:]
	return new

def replaceExtension(oldName, newExtension):
	k=oldName.rfind(".")
	new = oldName[:k] + "." + newExtension
	return new

resizedImg = ""
thumbnailImg = ""
Nitems= len(imgNameArray)
imgScript = 'var galleryItems = [\n'
for x in range(0, Nitems):
	Newline = slugify(imgNameArray[x])
	Newline = rreplace('-', Newline)
	imgNameArray[x]=imgNameArray[x].rstrip()
	tempResizedName = "resized-" + replaceExtension(Newline,"jpg")
	tempThumbName = "thumbnail-" + replaceExtension(Newline,"jpg")
	img = cv2.imread(imgNameArray[x])
	print(imgNameArray[x], img.shape[1], img.shape[0])
	if img.shape[1] > img.shape[0]:
		if img.shape[1] > 1800:
			resized = imutils.resize(img, width = 1800)
			print("case 1 ", imgNameArray[x], tempResizedName, tempThumbName)
		elif img.shape[1] < 1000:
			resized = imutils.resize(img, width = 1200); # enlarge small images a little
		else:
			resized = img;
	else: #(img.shape[1] <= img.shape[0])
		if img.shape[0] > 1800:
			resized = imutils.resize(img, height = 1800)
			print("case 2 ", imgNameArray[x], tempResizedName, tempThumbName)
		elif img.shape[0] < 1000:
			resized = imutils.resize(img, width = 1200); # enlarge small images a little
		else:
			resized = img;

	thumbnail = imutils.resize(img, height = 180) # all thumbnails are ~180
	cv2.imwrite(directoryName+galleryName + '/' + tempResizedName, resized)
	cv2.imwrite(directoryName+galleryName + '/' + tempThumbName, thumbnail)
	# get dimensions of image

	height = str(thumbnail.shape[0])
	width = str(thumbnail.shape[1])
	#print imgNameArray[x]
	#cmd = ['convert', imgNameArray[x],  '-auto-orient', '-resize', '1200x1200', tempResizedName]
	#subprocess.call(cmd, shell=False)
	#cmd = ['convert', imgNameArray[x],  '-auto-orient', '-resize', '300x300', tempThumbName]
	#subprocess.call(cmd, shell=False)
	#print tempResizedName
	#print tempThumbName

	#echo {
	#echo src: \'gallery_imgs/$resized_img\',
	#echo w: $X0,
	#echo h: $Y0,
	#echo msrc: \'gallery_imgs/$thumbnail_img\',
	#echo title: \'Image Caption\'
	#echo },


	#captionsArray[x] = captionsArray[x].rstrip()
	#captionsArray[x] = captionsArray[x].replace("\"", "&quot;")
	#captionsArray[x] = captionsArray[x].replace("\'", "&apos;")


	imgScript+='            {\n'
	imgScript+='               src: ' + "\'" + galleryName + '/' + tempResizedName + '\'' + ',\n'
	imgScript+='               width: ' + width  + ',\n'
	imgScript+='               height: ' + height  + ',\n'
	imgScript+='               msrc: ' + "\'" + galleryName + '/' + tempThumbName + '\'' + ',\n'
	#imgScript+='               title: ' + "\'" + captionsArray[x] + '\'\n'
	imgScript+='               title: ' + "\'" + imgNameArray[x] + '\'\n'
	imgScript+='             },\n'


#print Nitems

imgScript = imgScript[:-2] + '\n             ]\n' #erase the last ,\n and close bracket
#captions.close()
imageNames.close()
galleryJSname = directoryName+galleryName + ".js"
jsFile = open (galleryJSname,"w")
jsFile.write(imgScript)
jsFile.close()
#testImg = "test-jpeg-image.jpeg"
#testImgNew = "test-jpeg-image.jpg"

#cmd = ['convert', testImg,  '-auto-orient', '-resize', '1200x1200', testImgNew]
#cmd = ['convert', testImg,  '-auto-orient', '-resize', '300x300', testImgNew]

#subprocess.call(cmd, shell=False)
