const COLUMN_TEXT = `Patricia Dowd, 57, San Jose, Calif., auditor in Silicon Valley · Marion Krueger, 85, Kirkland, Wash., great-grandmother with an easy laugh · Jermaine Ferro, 77, Lee County, Fla., wife with little time to enjoy a new marriage · Cornelius Lawyer, 84, Bellevue, Wash., sharecropper's son · Loretta Mendoza Dionisio, 68, Los Angeles, cancer survivor born in the Philippines · Michael Sorkin, 71, New York City, champion of social justice through architecture · George Valentine, 66, Washington, D.C., lawyer who mentored others · James Quigley, 77, Chicago, rebel of the family · Sherman Pittman, 61, Chicago, dedicated his life to his church and his neighborhood · Susan McPherson, 74, Palm Beach, Fla., loyal and generous friend to many · Andreas Koutsoudakis, 59, New York City, trailblazer for TriBeCa · Bob Barnum, 64, St. Petersburg, Fla., leader in Florida Pride events · Noel Sinkiat, 64, Olney, Md., nurse planning for retirement · Thomas E. Anglin, 85, Cumming, Ga., created many wonderful memories for his family · Robert Manley Argo Jr., 75, South Bay, Calif., member of Del Amo Flyers · Michael McKinnell, 84, Beverly, Mass., architect of Boston's monumental City Hall · Huguette Dorsey, 94, Somerville, N.J., coached several championship-winning junior high girls basketball teams · Lynne Sierra, 68, Roselle, Ill., grandmother who was always full of ideas · Louvenia Henderson, 44, Tonawanda, N.Y., proud single mother of three · Carol Sue Rubin, 69, West Bloomfield, Mich., loved travel, mahjong and crossword puzzles · Cristina Bailargeon, 64, New York City, downtown New York singer with a cult following · Robert H. Westphal, 75, Fond du Lac, Wis., statesman in the construction industry · Clair Dunlap, 89, Washington, pilot still teaching people to fly at 88 · Marylou Armer, 43, Sonoma Valley, Calif., veteran police detective · Regina D. Cullen, 81, Shrewsbury, Mass., small in stature but strong in spirit · Sandra Santos-Vizcaino, 54, New York City, beloved public school teacher · Frank Gabrin, 60, New York City, emergency room doctor who died in husband's arms · Sterling E. Matthews, 60, Midlothian, Va., cancer survivor who served as a deacon · Alby Kass, 89, California, lead singer of a Yiddish folk group · Roger Eckart, 78, Indiana, retired firefighter and old-school barber · Martin Douglas, 71, New York City, maestro of a steel-pan band · Daniel Spector, 68, Memphis, mentor to other Memphis artists · Mary Minervini, 91, Oak Lawn, Ill., sign-language interpreter · Salomon S. Podgursky, 84, Morristown, N.J., loved to figure out how things worked · Dale E. Thurman, 65, Lexington, Ky., tailor known for his exacting work and strong opinions · Ellis Marsalis, 85, New Orleans, jazz pianist and patriarch of a family of musicians · Viraf Darukhanawalla, 77, Hoffman Estates, Ill., worker at O'Hare International Airport · Chester Dwulet, 68, Burlington, Mass., proud Union Ironworker of Local 7 for 45 years · John Timothy Barr, 76, Rochester Hills, Mich., trustee for the Retired Detroit Police and Firefighters Association · Julie Butler, 62, New York City, veterinarian who served Harlem · Lila A. Fenwick, 87, New York City, first black woman to graduate from Harvard Law School · Vincent Lionti, 60, New York City, Met Opera violist and youth orchestra conductor · Ann Youngerman Smoler, 87, New York City, had a passion for social justice · Thomas Waters, 56, New York City, armed the affordable housing movement with data and analysis · Luke Workoff, 33, Huntington, N.Y., his relentless passion was for his family and friends · José Díaz-Ayala, 38, Palm Beach, Fla., served with the Palm Beach County Sheriff's Office for 14 years · Antonio Nieves, 73, Chicago, always seemed to be busy with some home project · Jeanne Hammond Byrnes, 97, Danbury, Conn., received numerous awards for her accounting skills · Jack Butler, 78, Indiana, lived in the house he grew up in · Susan Grey Hopp Crofoot, 97, Westwood, N.J., took great joy in writing little ditties under her pen name · James David Gewirtzman, 72, New City, N.Y., spent some of his happiest hours hiking in the Adirondacks · Henry F. Graff, 98, Greenwich, Conn., Columbia University historian of U.S. presidents · Mari Jo Davitto, 82, Thornton, Ill., people were her hobby · Yaakov Perlow, 89, New York City, leader of the Novominsker Hasidic dynasty · Joseph F. Kelly, 81, New York City, did two tours through the Panama Canal to Antarctica · John Prine, 73, Nashville, country-folk singer who was a favorite of Bob Dylan · Perry Buchalter, 63, Florida, quiet hero · Monica Maley, 74, Rehoboth Beach, Del., loved animals, had dogs and cats, and rode horses · Thomas Tarbell Russell, 83, Longmeadow, Mass., mentored by the computer science pioneer Grace Hopper · Ruth Skapinok, 85, Roseville, Calif., backyard birds were known to eat from her hand · Faralyn Havir, 92, Minnesota, her favorite thing was meeting new people · Stan Chera, 77, New York City, developer and friend of the president · Robby Browne, 72, New York City, Realtor and philanthropist who socialized with celebrities · Wynn Handman, 97, New York City, acting teacher and a founder of the American Place Theater · Peter Brown, 53, New Jersey, manager of the S.W. Brown & Son Funeral Home · Ben Doherty, 83, Boston, stockbroker who founded Doherty Financial Services · John Horton Conway, 82, New Brunswick, N.J., mathematician known as the magical genius · `

const columnStyle = (font) => ({
  fontFamily: `'${font}', 'Libre Baskerville', Georgia, serif`,
  fontSize: 6.2,
  lineHeight: 1.55,
  color: '#ffffff',
  padding: '10px 7px',
  wordBreak: 'break-word',
  whiteSpace: 'normal',
})

export default function NewspaperColumns({ font, opacity }) {
  const text = COLUMN_TEXT.repeat(4)

  return (
    <>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 104, overflow: 'hidden',
        opacity, pointerEvents: 'none',
      }}>
        <div style={columnStyle(font)}>{text}</div>
      </div>

      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 104, overflow: 'hidden',
        opacity, pointerEvents: 'none',
      }}>
        <div style={columnStyle(font)}>{text}</div>
      </div>
    </>
  )
}
