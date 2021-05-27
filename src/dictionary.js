var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');

module.exports = {
  titles: {
    // objective: ['objective', 'objectives'],
    // summary: ['summary'],
    address: ['address','adresse'],
    ActAssociatives: ['expériences associatives','vie associative','activités','activites'],
    experience: ['experience professionnelle et associative','experiences pro.','experiences pro','experiences','stages professionnels','stages'],
    education: ['education','parcours académique','formations','formation'],
    skills: ['skills', 'Skills & Expertise','compétences','competences'],
    languages: ['langues','L angue'],
    // courses: ['courses'],
    projects: ['projets academiques','projects','projets'],
    // links: ['links'],
    // contacts: ['contacts','contact'],
    // positions: ['positions', 'position'],
    profiles: [
      'profile',
    ],
    // awards: ['awards'],
    // honors: ['honors'],
    additional: ['additional'],
    certification: ['certification', 'certifications','certificats','certi cations'],
    interests: ['interests',"centre d'interet","centre d'intérêt",'passions'],
  },
  profiles: [
    // [
    //   'github.com',
    //   function(url, Resume, profilesWatcher) {
    //     download(url, function(data, err) {
    //       if (data) {
    //         var $ = cheerio.load(data),
    //           fullName = $('.vcard-fullname').text(),
    //           location = $('.octicon-location')
    //             .parent()
    //             .text(),
    //           mail = $('.octicon-mail')
    //             .parent()
    //             .text(),
    //           link = $('.octicon-link')
    //             .parent()
    //             .text(),
    //           clock = $('.octicon-clock')
    //             .parent()
    //             .text(),
    //           company = $('.octicon-organization')
    //             .parent()
    //             .text();

    //         Resume.addObject('github', {
    //           name: fullName,
    //           location: location,
    //           email: mail,
    //           link: link,
    //           joined: clock,
    //           company: company,
    //         });
    //       } else {
    //         return console.log(err);
    //       }
    //       //profilesInProgress--;
    //       profilesWatcher.inProgress--;
    //     });
    //   },
    // ],
    // [
    //   'gitlab.com',
    //   function(url, Resume, profilesWatcher) {
    //     download(url, function(data, err) {
    //       if (data) {
    //         var $ = cheerio.load(data),
    //           fullName = $('.vcard-fullname').text(),
    //           location = $('.octicon-location')
    //             .parent()
    //             .text(),
    //           mail = $('.octicon-mail')
    //             .parent()
    //             .text(),
    //           link = $('.octicon-link')
    //             .parent()
    //             .text(),
    //           clock = $('.octicon-clock')
    //             .parent()
    //             .text(),
    //           company = $('.octicon-organization')
    //             .parent()
    //             .text();

    //         Resume.addObject('gitlab', {
    //           name: fullName,
    //           location: location,
    //           email: mail,
    //           link: link,
    //           joined: clock,
    //           company: company,
    //         });
    //       } else {
    //         return console.log(err);
    //       }
    //       //profilesInProgress--;
    //       profilesWatcher.inProgress--;
    //     });
    //   },
    // ],
    [
      'linkedin.com',
      function(url, Resume, profilesWatcher) {
        download(url, function(data, err) {
          if (data) {
            var $ = cheerio.load(data),
              linkedData = {
                positions: {
                  past: [],
                  current: {},
                },
                languages: [],
                skills: [],
                educations: [],
                volunteering: [],
                volunteeringOpportunities: [],
              },
              $pastPositions = $('.past-position'),
              $currentPosition = $('.current-position'),
              $languages = $('#languages-view .section-item > h4 > span'),
              $skills = $(
                '.skills-section .skill-pill .endorse-item-name-text'
              ),
              $educations = $('.education'),
              $volunteeringListing = $('ul.volunteering-listing > li'),
              $volunteeringOpportunities = $(
                'ul.volunteering-opportunities > li'
              );

            linkedData.summary = $('#summary-item .summary').text();
            linkedData.name = $('.full-name').text();
            // current position
            linkedData.positions.current = {
              title: $currentPosition.find('header > h4').text(),
              company: $currentPosition.find('header > h5').text(),
              description: $currentPosition.find('p.description').text(),
              period: $currentPosition.find('.experience-date-locale').text(),
            };
            // past positions
            _.forEach($pastPositions, function(pastPosition) {
              var $pastPosition = $(pastPosition);
              linkedData.positions.past.push({
                title: $pastPosition.find('header > h4').text(),
                company: $pastPosition.find('header > h5').text(),
                description: $pastPosition.find('p.description').text(),
                period: $pastPosition.find('.experience-date-locale').text(),
              });
            });
            _.forEach($languages, function(language) {
              linkedData.languages.push($(language).text());
            });
            _.forEach($skills, function(skill) {
              linkedData.skills.push($(skill).text());
            });
            _.forEach($educations, function(education) {
              var $education = $(education);
              linkedData.educations.push({
                title: $education.find('header > h4').text(),
                major: $education.find('header > h5').text(),
                date: $education.find('.education-date').text(),
              });
            });
            _.forEach($volunteeringListing, function(volunteering) {
              linkedData.volunteering.push($(volunteering).text());
            });
            _.forEach($volunteeringOpportunities, function(volunteering) {
              linkedData.volunteeringOpportunities.push($(volunteering).text());
            });

            Resume.addObject('linkedin', linkedData);
          } else {
            return console.log(err);
          }
          profilesWatcher.inProgress--;
        });
      },
    ],
  ],
  inline: {
    skype: 'skype',
  },
  regular: {
    name: [/([A-Z][a-z]{6})[ ]([A-Z][a-z]{5})[ \n]([A-Z]{7})|([A-Z][a-z]{2,})[ ]([A-Z]{3,})|([A-Z]{3,})[ ]([A-Z][a-z]{2,})|([A-Z][a-z]{2,})[ ]([A-Z][a-z]{2,})|([A-Z]{3,})[ ]([A-Z]{3,})/],//
    email: [/([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})/],
    phone: [/([ (]?(?:\+(\d{1,3}))?[. (]*(\d{2,3})[. )]*(\d{2,3})[. ]*(\d{2,3})[. ]*(\d{2})?)|((\d{2})[. ]*(\d{2})[. ]*(\d{2})[. ]*(\d{2})[. ]*(\d{2}))/],
    // tel: [/(\d{2})[. ]*(\d{2})[. ]*(\d{2})[. ]*(\d{2})[. ]*(\d{2})/],
    etatCivil: [/celibataire|fiancée|marié|célibataire|Célibataire|Fiancée/],
    // langues: [/Arabe|Anglais|Francais|Français|Espagnol|Allemand|Chinois|Italien|Hindi|Russe|Portugais|Bengali|Japonais|Coréen|Turc|Roumain|arabe|anglais|francais|français|espagnol|allemand|chinois|italien|hindi|russe|portugais|bengali|japonais|coréen|turc|roumain/],
    // adresse: [/(\d{1,}) [a-zA-Z0-9\s]+(\.)? [a-zA-Z0-9]/],
    dateBirdh: [/([0-3][0-9])[- /.]([0-1][0-9])[- /.]([1-2][0-9]{3})/],
    // linkedin: [/^www\.[a-z]{2,3}\.linkedin\.com\/.*$/],
    // github: [/^linkedin\\.com\\.*$/],
    // gitlab:[/http(s)?:\/\/([\w]+\.)?gitlab\.com\/in\/[A-z0-9_-]+\/?/]
  },
};

// helper method
function download(url, callback) {
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    } else {
      callback(null, error);
    }
  });
}
