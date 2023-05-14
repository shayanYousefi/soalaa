import process from 'process'
import Time from 'src/plugins/time.js'
import { Exam } from 'src/models/Exam.js'
import API_ADDRESS from 'src/api/Addresses.js'
import Assistant from 'src/plugins/assistant.js'
import ExamData from 'src/assets/js/ExamData.js'
import SocketConnection from 'src/plugins/socket.js'
import { QuestCategoryList } from 'src/models/QuestCategory.js'
import { QuestSubcategory, QuestSubcategoryList } from '../models/QuestSubcategory.js'

const mixinQuiz = {
  computed: {
    isQuizPage () {
      return this.$route.name === 'onlineQuiz.quiz'
    },
    quiz: {
      get () {
        return this.$store.getters['Exam/quiz']
      },
      set (newInfo) {
        this.$store.commit('Exam/updateQuiz', newInfo)
      }
    },
    userQuizListData () {
      return this.$store.getters['Exam/userQuizListData']
    },
    userQuestionData () {
      return (questionId) => {
        let questionData = this.getUserQuestionData(undefined, questionId)
        // let questionData = this.userQuizListData[this.quiz.user_exam_id][questionId]
        if (!questionData) {
          questionData = this.getCurrentExamQuestions(false)[questionId]
        }
        return questionData
      }
    },
    currentExamFrozenQuestions () {
      return this.$store.getters['Exam/currentExamFrozenQuestions']
    },
    currentQuestion: {
      get () {
        return this.$store.getters['Exam/currentQuestion']
      },
      set (newInfo) {
        this.$store.commit('Exam/updateCurrentQuestion', {
          newQuestionId: newInfo.id,
          currentExamQuestions: this.getCurrentExamQuestions()
        })
      }
    },
    currentLesson () {
      // this.$store.commit('reloadQuizModel')
      // let currentLesson = new QuestSubcategory()
      if (!this.currentQuestion || !this.currentQuestion.sub_category) {
        return new QuestSubcategory()
      }
      const currentSubCategoryId = this.currentQuestion.sub_category.id
      return this.quiz.sub_categories.list.find((item) => Assistant.getId(item.id) === Assistant.getId(currentSubCategoryId))
      // if (!this.currentQuestion.sub_category) {
      //   this.loadFirstQuestion()
      // }

      // if (this.getCurrentExam().questions.list.length > 0 && this.currentQuestion.sub_category) {
      //   let subCategoryId = Assistant.getId(this.currentQuestion.sub_category.id)
      //   currentLesson = this.getCurrentExam().sub_categories.getItem('id', subCategoryId)
      // }

      // return currentLesson
    },
    currentExamQuestions () {
      return window.currentExamQuestions
    }
  },
  data () {
    return {
      bookletsDialog: false,
      useSocket: true,
      socketTimeout: 2000,
      socket: null,
      considerActiveCategoryAndSubcategory: false
    }
  },
  methods: {
    setSocket (token, examId, callbacks) {
      if (!this.useSocket) {
        this.socket = false
        return
      }

      this.socket = SocketConnection.getInstance(token, examId)
      this.setSocketEvents(callbacks)
      if (!this.socket.connected) {
        this.socket.connect()
      }
    },
    sendDataBySocket (socket, channel, payload) {
      return new Promise((resolve, reject) => {
        socket.timeout(this.socketTimeout).emit(channel, payload, (socketError, serverResponse) => {
          if (socketError) {
            socket.disconnect()
            socket.connect()
            reject(socketError)
          }
          if (!serverResponse || serverResponse.error) {
            reject(serverResponse)
          } else {
            resolve(serverResponse)
          }
        })
      })
    },
    disconnectSocket () {
      if (!this.useSocket || !this.socket) {
        this.socket = false
        return
      }

      this.socket.disconnect()
    },
    setSocketEvents (callbacks) {
      this.socket.on('reconnect', () => {
        this.socket.emit('socket.event.reconnect:log', 'socket.event.reconnect:log')
        // // client
        // this.socket.emit("test", dataToSend, function(err, success) {
        // })
      })
      this.socket.on('question.file-link:update', (data) => {
        const questionsFileUrl = data.questionFileLink
        const that = this
        this.reloadQuestionFile(questionsFileUrl, 'onlineQuiz.alaaView', this.$route.params.quizId)
          .then(() => {
            that.isRtl = !that.isLtrString(that.currentQuestion.statement)
            that.$store.commit('AppLayout/updateOverlay', { show: false, loading: false, text: '' })
            if (callbacks && callbacks['question.file-link:update'] && callbacks['question.file-link:update'].afterReload) {
              callbacks['question.file-link:update'].afterReload()
            }
          })
          .catch((error) => {
            Assistant.reportErrors(error)
            that.$notify({
              group: 'notifs',
              title: 'توجه!',
              text: 'مشکلی در دریافت اطلاعات آژمون رخ داده است. لطفا دوباره امتحان کنید.',
              type: 'error'
            })
            that.$router.push({ name: 'User.Exam.List' })
          })
      })

      // eslint-disable-next-line no-unreachable
      // this.socket.on('connect', () => {
      //   const engine = this.socket.io.engine
      //   // console.log('engine.transport.name', engine.transport.name) // in most cases, prints "polling"
      //
      //   // console.log(this.socket.connected) // true
      //   // this.onSocketStatusChange('socket connected')
      //   // this.isConnected = true
      //
      //   engine.on('connecting', () => {
      //     // this.onSocketStatusChange('on connection')
      //   })
      //   engine.on('reconnect', () => {
      //     this.socket.emit('socket.event.reconnect:log', 'socket.event.reconnect:log')
      //     // // client
      //     // this.socket.emit("test", dataToSend, function(err, success) {
      //     // })
      //   })
      //   engine.on('disconnect', () => {
      //     // this.onSocketStatusChange('Socket to break off')
      //     // this.isConnected = false
      //   })
      //   engine.on('connect_failed', () => {
      //     // this.onSocketStatusChange('connection failed')
      //   })
      //   engine.on('question.file-link:update', (data) => {
      //     const questionsFileUrl = data.questionFileLink
      //     const that = this
      //     this.reloadQuestionFile(questionsFileUrl, 'onlineQuiz.alaaView', this.$route.params.quizId)
      //       .then(() => {
      //         that.isRtl = !that.isLtrString(that.currentQuestion.statement)
      //         that.$store.commit('AppLayout/updateOverlay', { show: false, loading: false, text: '' })
      //         if (callbacks && callbacks['question.file-link:update'] && callbacks['question.file-link:update'].afterReload) {
      //           callbacks['question.file-link:update'].afterReload()
      //         }
      //       })
      //       .catch((error) => {
      //         Assistant.reportErrors(error)
      //         that.$notify({
      //           group: 'notifs',
      //           title: 'توجه!',
      //           text: 'مشکلی در دریافت اطلاعات آژمون رخ داده است. لطفا دوباره امتحان کنید.',
      //           type: 'error'
      //         })
      //         that.$router.push({ name: 'User.Exam.List' })
      //       })
      //   })
      //
      //   engine.once('upgrade', () => {
      //     // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
      //     // console.log(engine.transport.name) // in most cases, prints "websocket"
      //   })
      //
      //   //
      //   // engine.on("packet", ({ type, data }) => {
      //   //     // called for each packet received
      //   // })
      //   //
      //   // engine.on("packetCreate", ({ type, data }) => {
      //   //     // called for each packet sent
      //   // })
      //   //
      //   // engine.on("drain", () => {
      //   //     // called when the write buffer is drained
      //   // })
      //   //
      //   // engine.on("close", (reason) => {
      //   //     // called when the underlying connection is closed
      //   // })
      // })
    },
    sendUserQuestionsDataToServerAndFinishExam (userExamId, finishExam) {
      const answers = this.getUserAnswers(userExamId)

      return this.$axios.post(API_ADDRESS.exam.sendAnswers, { exam_user_id: userExamId, finish: finishExam, questions: answers })
    },
    actionOnNoQuestionInExam () {
      this.$q.notify({
        type: 'negative',
        message: 'آزمون سوالی ندارد',
        position: 'top'
      })
      this.$store.commit('Exam/clearExamData', this.userExamId)
      this.$router.push({ name: 'User.Exam.List' })
    },
    reloadQuestionFile (questionsFileUrl, viewType, examId) {
      if (!Assistant.getId(examId)) {
        return
      }
      const that = this
      return new Promise((resolve, reject) => {
        const examData = new ExamData(this.$axios)
        window.currentExamQuestions = null
        window.currentExamQuestionIndexes = null
        examData.getExamDataAndParticipate(examId)
        examData.loadQuestionsFromFile()
        examData.getUserExamData()
          .run()
          .then((result) => {
            try {
              // save questions in localStorage
              that.saveCurrentExamQuestions(examData.exam.questions.list)
              // save exam info in vuex store (remove questions of exam then save in store)
              examData.exam.loadSubcategoriesOfCategories()
              const ACTIVE_ALL_CATEGORIES_IN_EXAM = process.env.ACTIVE_ALL_CATEGORIES_IN_EXAM === 'true'
              Time.setStateOfExamCategories(examData.exam.categories.list, ACTIVE_ALL_CATEGORIES_IN_EXAM)
              const currentExamQuestions = that.getCurrentExamQuestions()
              Time.setStateOfQuestionsBasedOnActiveCategory(examData.exam, currentExamQuestions)
              that.$store.commit('Exam/updateQuiz', examData.exam)
              that.setCurrentExamQuestions(currentExamQuestions)
              that.loadCurrentQuestion(viewType)
              that.reloadCurrentQuestion(viewType)

              that.$store.commit('Exam/mergeDbAnswersIntoLocalstorage', {
                dbAnswers: examData.userExamData,
                exam_id: examData.exam.id
              })
              setTimeout(() => { that.refreshFailedLists(examData.exam.user_exam_id) }, 0)

              if (this.getCurrentExamQuestionsInArray().length === 0) {
                this.actionOnNoQuestionInExam()
                reject(result)
                return
              }

              resolve(result)
            } catch (error) {
              console.error(error)
              that.$router.push({ name: 'User.Exam.List' })
              reject(error)
            }
          })
          .catch((error) => {
            reject(error)
            that.$router.push({ name: 'User.Exam.List' })
          })
          .finally(() => {
            that.$store.commit('loading/overlay', { loading: false, message: '' })
          })
      })
    },
    reloadCurrentQuestion (viewType) {
      const questNumber = this.getQuestNumber()
      const questionId = this.getQuestionIdFromNumber(questNumber)
      if (!questionId) {
        return
      }
      this.changeQuestion(questionId, viewType, true)
    },
    getQuestionIdFromNumber (number) {
      const questionIndex = this.getQuestionIndexFromNumber(number)
      const questionId = this.getCurrentExamQuestionIndexes()[questionIndex]
      if (questionIndex < 0 || !questionId) {
        return false
      }
      return questionId
    },
    getUserQuestionData (userExamId, questionId) {
      if (typeof questionId === 'undefined') {
        questionId = this.currentQuestion.id
      }
      if (typeof userExamId === 'undefined') {
        userExamId = this.quiz.user_exam_id
      }
      if (
        !userExamId ||
        !questionId ||
        !this.userQuizListData ||
        !this.userQuizListData[userExamId]
      ) {
        return false
      }
      return this.userQuizListData[userExamId][questionId]
    },
    getCurrentExam () {
      return this.$store.getters['Exam/quiz']
    },
    getCurrentExamQuestionIndexes () {
      if (window.currentExamQuestionIndexes && window.currentExamQuestionIndexes.length) {
        return window.currentExamQuestionIndexes
      }
      window.currentExamQuestionIndexes = JSON.parse(window.localStorage.getItem('currentExamQuestionIndexes'))
      return JSON.parse(window.localStorage.getItem('currentExamQuestionIndexes'))
    },
    setCurrentExamQuestions (currentExamQuestions) {
      window.currentExamQuestions = currentExamQuestions
      window.localStorage.setItem('currentExamQuestions', JSON.stringify(currentExamQuestions))
    },
    setCurrentExamQuestionIndexes (currentExamQuestionIndexes) {
      window.localStorage.setItem('currentExamQuestionIndexes', JSON.stringify(currentExamQuestionIndexes))
    },
    sortQuestions (questions) {
      const sortList = Array.prototype.sort.bind(questions)
      sortList(function (a, b) {
        const sorta = parseInt(a.order); const sortb = parseInt(b.order)

        if (sorta < sortb) {
          return -1
        }
        if (sorta > sortb) {
          return 1
        }
        return 0
      })
    },
    saveCurrentExamQuestions (questionsList) {
      const currentExamQuestions = {}
      const currentExamQuestionIndexes = {}

      this.sortQuestions(questionsList)
      questionsList.forEach((item, index) => {
        item.index = index
        this.setQuestionsLtr(item)
        currentExamQuestions[item.id.toString()] = item
        currentExamQuestionIndexes[index.toString()] = item.id
      })
      this.setCurrentExamQuestionIndexes(currentExamQuestionIndexes)
      this.modifyCurrentExamQuestions(currentExamQuestions)
      this.setCurrentExamQuestions(currentExamQuestions)
    },
    getUserAnswers (userExamId) {
      const userExamData = this.userQuizListData[userExamId]
      const answers = []

      for (const questionId in userExamData) {
        if (userExamData[questionId].answered_at) {
          answers.push({
            question_id: questionId,
            choice_id: userExamData[questionId].answered_choice_id,
            selected_at: (!userExamData[questionId].answered_at) ? null : userExamData[questionId].answered_at,
            bookmarked: userExamData[questionId].bookmarked,
            status: userExamData[questionId].status,
            check_in_times: userExamData[questionId].check_in_times
          })
        }
      }

      return answers
    },

    getCurrentExamQuestionsInArray () {
      let currentExamQuestionsArray = []
      if (this.quiz === {}) {
        currentExamQuestionsArray = this.quiz
        return currentExamQuestionsArray
      }

      const currentExamQuestionIndexes = this.getCurrentExamQuestionIndexes()
      const currentExamQuestions = this.getCurrentExamQuestions()
      if (!currentExamQuestionIndexes ||
        currentExamQuestionIndexes === {} ||
        Object.keys(currentExamQuestionIndexes).length === 0 ||
        (Array.isArray(currentExamQuestionIndexes) && currentExamQuestionIndexes.length === 0)) {
        return currentExamQuestionsArray
      }
      const currentExamQuestionIndexesArray = Object.keys(currentExamQuestionIndexes)
      currentExamQuestionIndexesArray.forEach((item) => {
        const questionId = currentExamQuestionIndexes[item]
        currentExamQuestionsArray.push(currentExamQuestions[questionId])
      })

      return currentExamQuestionsArray
    },
    getCurrentExamQuestions () {
      if (window.currentExamQuestions) {
        return window.currentExamQuestions
      }
      window.currentExamQuestions = JSON.parse(window.localStorage.getItem('currentExamQuestions'))
      this.modifyCurrentExamQuestions(window.currentExamQuestions)
      return window.currentExamQuestions
    },
    modifyCurrentExamQuestions (currentExamQuestions) {
      const currentExamQuestionsArray = []
      const currentExamQuestionIndexes = this.getCurrentExamQuestionIndexes()
      if (!currentExamQuestionIndexes) {
        return currentExamQuestionsArray
      }
      const currentExamQuestionIndexesArray = Object.keys(currentExamQuestionIndexes)
      currentExamQuestionIndexesArray.forEach((item) => {
        const questionId = currentExamQuestionIndexes[item]
        currentExamQuestionsArray.push(currentExamQuestions[questionId])
      })
      return currentExamQuestionsArray
    },
    getQuestionsOfSubcategory (subCatId) {
      const currentExamQuestions = this.getCurrentExamQuestions()
      const currentExamQuestionsArray = []
      for (const questionId in currentExamQuestions) {
        if (Assistant.getId(currentExamQuestions[questionId].sub_category.id) === Assistant.getId(subCatId)) {
          currentExamQuestionsArray.push(currentExamQuestions[questionId])
        }
      }

      return currentExamQuestionsArray
    },
    startExam (examId, viewType, retake, personal) {
      if (!Assistant.getId(examId)) {
        return
      }
      const that = this
      return new Promise((resolve, reject) => {
        let userExamId
        const examData = new ExamData(this.$axios)
        const needToLoadQuizData = this.needToLoadQuizData()
        if (needToLoadQuizData || retake) {
          this.saveCurrentExamQuestions([])
          this.$store.commit('Exam/cleanCurrentQuestion')
          this.bookletsDialog = true
          this.$store.commit('loading/overlay', true)
          examData.getExamDataAndParticipate(examId, retake, personal)
          examData.loadQuestionsFromFile()
        } else {
          userExamId = this.quiz.user_exam_id
        }
        examData.getUserExamData(userExamId)
          .run()
          .then((result) => {
            try {
              if (needToLoadQuizData || retake) {
                // save questions in localStorage
                that.saveCurrentExamQuestions(examData.exam.questions.list)
                // save exam info in vuex store (remove questions of exam then save in store)
                examData.exam.loadSubcategoriesOfCategories()
                const ACTIVE_ALL_CATEGORIES_IN_EXAM = process.env.ACTIVE_ALL_CATEGORIES_IN_EXAM === 'true'
                Time.setStateOfExamCategories(examData.exam.categories.list, ACTIVE_ALL_CATEGORIES_IN_EXAM)
                const currentExamQuestions = that.getCurrentExamQuestions()
                Time.setStateOfQuestionsBasedOnActiveCategory(examData.exam, currentExamQuestions)
                that.$store.commit('Exam/updateQuiz', examData.exam)
                that.setCurrentExamQuestions(currentExamQuestions)
                that.loadCurrentQuestion(viewType)
                that.reloadCurrentQuestion(viewType)
              } else {
                examData.exam = that.quiz
              }
              that.$store.commit('Exam/mergeDbAnswersIntoLocalstorage', {
                dbAnswers: examData.userExamData,
                user_exam_id: examData.exam.user_exam_id
              })
              setTimeout(() => { that.refreshFailedLists(examData.exam.user_exam_id) }, 0)

              if (this.getCurrentExamQuestionsInArray().length === 0) {
                this.actionOnNoQuestionInExam()
                reject(result)
                return
              }

              resolve(result)
            } catch (error) {
              that.$router.push({ name: 'User.Exam.List' })
              reject(error)
            }
          })
          .catch((error) => {
            this.$q.notify({
              type: 'negative',
              message: error.message,
              position: 'top'
            })
            reject(error)
            that.$router.push({ name: 'User.Exam.List' })
          })
          .finally(() => {
            that.$store.commit('loading/overlay', false)
          })
      })
    },
    getLatestUserAnswersFromServer () {
      const examData = new ExamData(this.$axios)
      examData.getUserExamData(this.quiz.user_exam_id)
        .run()
        .then((result) => {
          try {
            this.$store.commit('Exam/mergeDbAnswersIntoLocalstorage', {
              dbAnswers: examData.userExamData,
              user_exam_id: this.quiz.user_exam_id
            })
            setTimeout(() => { this.refreshFailedLists(this.quiz.user_exam_id) }, 0)
          } catch (error) {
            console.error(error)
          }
        })
    },
    needToLoadQuizData () {
      // ToDo: any change on exam make a problem (ex: change category time). because use on local device can't find that change
      return true
      // return (!Assistant.getId(this.quiz.id) || !Assistant.getId(this.quiz.user_exam_id) || Assistant.getId(this.$route.params.quizId) !== Assistant.getId(this.quiz.id))
      // return (
      //   !Assistant.getId(this.quiz.id) ||
      //   !Assistant.getId(this.quiz.user_exam_id) ||
      //   Assistant.getId(this.$route.params.quizId) !== Assistant.getId(this.quiz.id)
      // )
    },
    setQuestionsLtr (question) {
      question.ltr = !this.isLtrString(question.statement)
      // if (!question.statement) {
      //     return
      // }
      // const englishRegex = /^[A-Za-z0-9 :"'ʹ.<>%$&@!+()\-_/\n,…?ᵒ*~]*$/
      // question.ltr = !!question.statement.match(englishRegex);
    },
    loadExamExtraData (quiz, viewType) {
      this.quiz.loadSubcategoriesOfCategories()

      if (viewType !== 'results') {
        const currentExamQuestions = this.getCurrentExamQuestions()
        const ACTIVE_ALL_CATEGORIES_IN_EXAM = process.env.ACTIVE_ALL_CATEGORIES_IN_EXAM === 'true'
        Time.setStateOfExamCategories(quiz.categories.list, ACTIVE_ALL_CATEGORIES_IN_EXAM)
        Time.setStateOfQuestionsBasedOnActiveCategory(quiz, currentExamQuestions)
        this.setCurrentExamQuestions(currentExamQuestions)
      }

      this.$store.commit('Exam/updateQuiz', quiz)
    },
    getQuestNumber () {
      let questNumber = this.$route.params.questNumber
      if (!questNumber && this.currentQuestion.order) {
        questNumber = this.currentQuestion.order
      } else if (!questNumber) {
        questNumber = 1
      }

      return questNumber
    },
    loadCurrentQuestion (viewType) {
      const questNumber = this.getQuestNumber()
      this.loadQuestionByNumber(questNumber, viewType)
    },
    loadFirstQuestion () {
      this.loadQuestionByNumber(1)
    },
    loadQuestionByNumber (number, viewType) {
      const questionId = this.getQuestionIdFromNumber(number)
      if (!questionId) {
        return
      }
      this.changeQuestion(questionId, viewType)
    },
    hasExamDataOnThisDeviseStorage (userExamId) {
      return !!this.userQuizListData[userExamId]
    },
    syncUserAnswersWithDBAndSendAnswersToServerInExamTime (userExamId, finishExam) {
      const questions = this.getUserAnswers(userExamId)

      return this.$axios.post(API_ADDRESS.exam.sendAnswers, { exam_user_id: userExamId, finish: finishExam, questions })
    },
    syncUserAnswersWithDBAndSendAnswersToServerAfterExamTime (userExamId, finishExam) {
      const questions = this.getUserAnswers(userExamId)

      return this.$axios.post(API_ADDRESS.exam.sendAnswersAfterExam, { exam_user_id: userExamId, finish: finishExam, questions })
    },
    isLtrString (string) {
      if (!string) {
        return false
      }
      // const englishRegex = /^[A-Za-z0-9 :"'ʹ.<>%$&@!+()\-/\n,…?;ᵒ*~]*$/
      // return !!string.match(englishRegex)
      const persianRegex = /[\u0600-\u06FF]/
      return !string.match(persianRegex)
    },
    answerClicked (data, sendData = true, callback) {
      const questionId = data.questionId

      const socket = (this.useSocket) ? this.socket : false
      return this.userActionOnQuestion(questionId, 'answer', { choiceId: data.choiceId }, socket, sendData, callback)
    },
    changeBookmark (questionId) {
      const socket = (this.useSocket) ? this.socket : false
      return this.userActionOnQuestion(questionId, 'bookmark', null, socket)
    },
    changeStatus (questionId, newStatus) {
      const socket = (this.useSocket) ? this.socket : false
      return this.userActionOnQuestion(questionId, 'status', { newStatus }, socket)
    },
    getQuestionNumberFromIndex (index) {
      index = parseInt(index)
      return index + 1
    },
    convertBubbleSheetResponseToUserAnswerResponse (examUserId, bubbleSheetResponse) {
      const userAnswerResponse = {
        choices: [
          // {
          //     "id": "61dd404df28c746e5a0aaf53",
          //     "exam_user_id": "61dd2e0bf07492290b57097a",
          //     "question_id": "61d95bfe3e17411c7775770c",
          //     "choice_id": 1,
          //     "type": "online",
          //     "selected_at": "2022-01-11 12:01:08.951",
          //     "status": null,
          //     "bookmark": null
          // }
        ],
        statuses: [],
        bookmarks: []
      }

      // const bubbleSheetResponse = [
      //         {
      //             "q_n": 1,
      //             "c_n": [
      //                 1
      //             ]
      //         },
      //         {
      //             "q_n": 2,
      //             "c_n": [
      //                 2
      //             ]
      //         }
      //     ]

      userAnswerResponse.choices = bubbleSheetResponse.map(item => {
        const choiceNumber = (typeof item.c_n[0] === 'undefined') ? null : item.c_n[0]
        return {
          id: item.q_n,
          examUserId,
          question_id: item.q_n,
          choice_id: choiceNumber,
          has_warning: (typeof item.c_n[1] !== 'undefined'),
          selected_at: Time.now()
        }
      }
      )

      return userAnswerResponse
    },
    getQuestionNumberFromId (id) {
      const currentExamQuestions = this.getCurrentExamQuestions()
      if (!currentExamQuestions || typeof id === 'undefined' || id === null) {
        return 1
      }
      const targetQuestion = currentExamQuestions[id]
      if (!targetQuestion) {
        return 1
      }
      const questionIndex = targetQuestion.index
      // return this.getQuestionNumberFromIndex(questionIndex)
      return +questionIndex + 1
    },
    getQuestionIndexFromNumber (number) {
      number = parseInt(number)
      return number - 1
    },
    getFirstActiveQuestion () {
      const questions = this.getCurrentExamQuestions()
      for (const questionId in questions) {
        if (questions[questionId].in_active_category) {
          return questions[questionId]
        }
      }
      return null
    },
    getCategoryActiveStatus (categoryId) {
      const category = this.quiz.categories.list.find((item) => Assistant.getId(item.id) === Assistant.getId(categoryId))
      return !category || category.is_active
    },
    getQuestionIndexById (questionId) {
      const currentExamQuestionIndexes = this.getCurrentExamQuestionIndexes()
      for (const index in currentExamQuestionIndexes) {
        if (currentExamQuestionIndexes[index] === questionId) {
          return index
        }
      }
    },
    getQuestionByIndex (questionIndex) {
      const question = this.getCurrentExamQuestions()[this.getCurrentExamQuestionIndexes()[questionIndex]]
      if (question) {
        return question
      } else {
        return false
      }
    },
    getNextQuestion (questionId) {
      let currentIndex = this.getQuestionIndexById(questionId)
      const nextIndex = ++currentIndex
      return this.getQuestionByIndex(nextIndex)
    },
    getPrevQuestion (questionId) {
      let currentIndex = this.getQuestionIndexById(questionId)
      const prevIndex = --currentIndex
      return this.getQuestionByIndex(prevIndex)
    },
    goToCategory (categoryId) {
      const currentExamQuestionsInArray = this.getCurrentExamQuestionsInArray()
      const currentQuestionCategoryId = this.currentQuestion.sub_category.category_id
      const currentQuestionCategoryIsSameCategory = currentQuestionCategoryId === categoryId
      const firstQuestionOfCategory = (currentQuestionCategoryIsSameCategory) ? this.currentQuestion : currentExamQuestionsInArray.find((item) => Assistant.getId(item.sub_category.category_id) === Assistant.getId(categoryId))
      if (!firstQuestionOfCategory) {
        return
      }
      this.changeQuestion(firstQuestionOfCategory.id)
    },
    goToNextQuestion (viewType) {
      const question = this.getNextQuestion(this.currentQuestion.id)
      if (!question) {
        return
      }
      this.changeQuestion(question.id, viewType)
    },
    goToPrevQuestion (viewType) {
      const question = this.getPrevQuestion(this.currentQuestion.id)
      if (!question) {
        return
      }

      this.changeQuestion(question.id, viewType)
    },
    changeQuestion (id, viewType, mandatory) {
      if (Assistant.getId(this.currentQuestion.id) === Assistant.getId(id)) {
        return
      }

      let questIndex = this.getQuestionIndexById(id)
      let questNumber = this.getQuestionNumberFromIndex(questIndex)

      if (typeof questIndex === 'undefined') {
        return
      }

      const currentExamQuestions = this.getCurrentExamQuestions()
      let currentQuestion = currentExamQuestions[id]

      if (this.considerActiveCategoryAndSubcategory) {
        const currentQuestionCategoryActiveStatus = this.getCategoryActiveStatus(currentQuestion.sub_category.category_id)

        if (!currentQuestionCategoryActiveStatus) {
          currentQuestion = this.getFirstActiveQuestion()
          if (!currentQuestion) {
            return
          }
          questIndex = this.getQuestionIndexById(currentQuestion.id)
          questNumber = this.getQuestionNumberFromIndex(questIndex)
        }
      }

      this.$store.commit('Exam/updateCurrentQuestion', {
        newQuestionId: currentQuestion.id,
        currentExamQuestions: this.getCurrentExamQuestions(),
        mandatory
      })
      if (parseInt(this.$route.params.questNumber) !== parseInt(questNumber) && this.$route.name !== 'konkoorView' && this.$route.name !== 'onlineQuiz.bubblesheet-view') {
        this.loadExamPageByViewType(this.quiz.id, questNumber, viewType)
      }
    },
    loadExamPageByViewType (examId, questNumber, routeName) {
      if (!routeName) {
        routeName = 'onlineQuiz.alaaView'
      }
      this.$router.push({ name: routeName, params: { quizId: examId, questNumber } })
    },
    changeView (routeName) {
      if (routeName.search('onlineQuiz.alaaView') !== -1) {
        const questionNumber = this.getQuestionNumberFromId(this.currentQuestion.id)
        this.$router.push({
          name: routeName,
          params: { quizId: this.quiz.id, questNumber: questionNumber }
        })
      } else if (routeName.search('onlineQuiz.konkoorView') !== -1) {
        this.$store.commit('AppLayout/updateLayoutLeftDrawerVisible', false)
        setTimeout(() => {
          this.$router.push({ name: 'konkoorView', params: { quizId: this.quiz.id } })
        }, 200)
      }
    },

    getExamUserData (examId) {
      return new Promise((resolve, reject) => {
        this.$axios.post(API_ADDRESS.exam.examUser, { examId })
          .then((response) => {
            const userExamForParticipate = new Exam()
            userExamForParticipate.id = Assistant.getId(response.data.data.exam_id)
            userExamForParticipate.user_exam_id = Assistant.getId(response.data.data.id)
            userExamForParticipate.created_at = response.data.data.created_at
            userExamForParticipate.questions_file_url = response.data.data.questions_file_url
            userExamForParticipate.categories = new QuestCategoryList(response.data.data.categories)
            userExamForParticipate.sub_categories = new QuestSubcategoryList(response.data.data.sub_categories)
            resolve(userExamForParticipate)
          })
          .catch((error) => {
            Assistant.reportErrors({ location: 'GetExamDataFroParticipate' })
            reject(error)
          })
      })
    }
  }
}

export default mixinQuiz
